import CSSDebugger from "utils/CSSDebugger"
import Enum from "utils/Enum"
import platform from "utils/platform"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"

import "./Editor.css"

// https://w3.org/TR/input-events-2/#interface-InputEvent-Attributes
const backspaceRe = /^delete(Content|Word|(Soft|Hard)Line)Backward$/

// Discretionary timers (17ms)
const discTimer = {
	data:   2,   // data=x
	pos:    2.5, // pos=x
	parser: 5,   // parser=x
	render: 5,   // render=x
	range:  2.5, // range=x
}

const ActionTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"INPUT",
)

const initialState = {
	epoch: 0,
	actionType: "",
	actionTimeStamp: 0,
	focused: false,
	data: "",
	pos1: 0,
	pos2: 0,
	collapsed: false,
	components: null,
	shouldRender: 0,
	reactDOM: null,
}

const reducer = state => ({
	newAction(actionType) {
		const actionTimeStamp = Date.now() - state.epoch
		if (actionType === ActionTypes.SELECT && actionTimeStamp - state.actionTimeStamp < 100) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimeStamp })
	},
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.focused = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.focused = false
	},
	actionSelect(pos1, pos2) {
		this.newAction(ActionTypes.SELECT)
		const collapsed = pos1 === pos2
		Object.assign(state, { pos1, pos2, collapsed })
	},
	actionInput(data, pos1, pos2) {
		this.newAction(ActionTypes.INPUT)
		Object.assign(state, { data, pos1, pos2 })
		this.render()
	},
	// NOTE: dropL and dropR are expected to be >= 0
	write(substr, dropL = 0, dropR = 0) {
		// if (!state.pos1 && dropL) {
		// 	// No-op
		// 	return
		// }
		// if (state.pos2 === state.data.length && dropR) {
		// 	// No-op
		// 	return
		// }
		const data = state.data.slice(0, state.pos1 - dropL) + substr + state.data.slice(state.pos2 + dropR)
		const pos1 = state.pos1 - dropL + substr.length
		const pos2 = pos1
		this.actionInput(data, pos1, pos2)
	},
	backspaceL() {
		let dropL = 1
		if (!state.collapsed) {
			dropL = 0
		}
		this.write("", dropL, 0)
	},
	backspaceR() {
		let dropR = 1
		if (!state.collapsed) {
			dropR = 0
		}
		this.write("", 0, dropR)
	},
	tab() {
		this.write("\t")
	},
	enter() {
		this.write("\n")
	},
	render() {
		state.components = parseComponentsFromData(state.data)
		state.shouldRender++
	},
})

const init = initialValue => initialState => {
	const epoch = Date.now()
	const state = {
		...initialState,
		epoch,
		actionType: ActionTypes.INIT,
		actionTimeStamp: Date.now() - epoch,
		data: initialValue,
		components: parseComponentsFromData(initialValue),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

// Gets cursors from a range.
function getPosFromRange(rootNode, node, offset) {
	// const t1 = Date.now()
	let pos = 0
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			if (childNodes[index] === node) {
				pos += offset
				return true
			}
			pos += (childNodes[index].nodeValue || "").length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.hasAttribute("data-node")) {
				pos++
			}
			index++
		}
		return false
	}
	recurse(rootNode)
	// const t2 = Date.now()
	// if (t2 - t1 >= discTimer.pos) {
	// 	console.log(`pos=${t2 - t1}`)
	// }
	return pos
}

// Gets (recursively reads) plain text data.
function getData(rootNode) {
	const t1 = Date.now()
	let data = ""
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			data += childNodes[index].nodeValue || ""
			recurse(childNodes[index])
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.hasAttribute("data-node")) {
				data += "\n"
			}
			index++
		}
	}
	recurse(rootNode)
	const t2 = Date.now()
	if (t2 - t1 >= discTimer.data) {
		console.log(`data=${t2 - t1}`)
	}
	return data
}

// Gets the range from a cursor; code based on
// getPosFromRange.
function getRangeFromPos(rootNode, pos) {
	let node = null
	let offset = 0
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			// const nodeValue = childNodes[index].nodeValue || ""
			const { length } = childNodes[index].nodeValue || ""
			if (pos - length <= 0) {
				node = childNodes[index]
				offset = pos
				return true
			}
			pos -= length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.hasAttribute("data-node")) {
				pos--
			}
			index++
		}
		return false
	}
	recurse(rootNode)
	return { node, offset }
}

// // Compares whether two DOM trees are equal -- root nodes
// // **are not** compared.
// function areEqualTrees(treeA, treeB) {
// 	if (treeA.childNodes.length !== treeB.childNodes.length) {
// 		return false
// 	}
// 	let index = 0
// 	while (index < treeA.childNodes.length) {
// 		if (!treeA.childNodes[index].isEqualNode(treeB.childNodes[index])) {
// 			return false
// 		}
// 		index++
// 	}
// 	return true
// }

// Syncs two trees -- root nodes are not synced.
function syncTrees(treeA, treeB) {
	let didMutate = false
	let start = 0
	const min = Math.min(treeA.childNodes.length, treeB.childNodes.length)
	while (start < min) {
		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
			didMutate = true
		}
		start++
	}
	// Push extraneous nodes:
	if (start < treeB.childNodes.length) {
		while (start < treeB.childNodes.length) {
			treeA.append(treeB.childNodes[start].cloneNode(true))
			start++
		}
		didMutate = true
	// Drop extraneous nodes:
	} else if (start < treeA.childNodes.length) {
		let end = treeA.childNodes.length - 1 // Iterate backwards
		while (end >= start) {
			treeA.childNodes[end].remove()
			end--
		}
		didMutate = true
	}
	return didMutate
}

// // Syncs two trees -- root nodes are not synced.
// function syncTrees(treeA, treeB) {
// 	let didMutate = false
// 	// Iterate forwards (before replkaceWith):
// 	let start = 0
// 	const min = Math.min(treeA.childNodes.length, treeB.childNodes.length)
// 	while (start < min) {
// 		if (!treeA.childNodes[start].isEqualNode(treeB.childNodes[start])) {
// 			treeA.childNodes[start].replaceWith(treeB.childNodes[start].cloneNode(true))
// 			didMutate = true
// 			start++ // Increment because of break
// 			break
// 		}
// 		start++
// 	}
// 	// Iterate backwards (after replaceWith):
// 	let end1 = treeA.childNodes.length - 1
// 	let end2 = treeB.childNodes.length - 1
// 	while (end1 > start && end2 > start) {
// 		if (!treeA.childNodes[end1].isEqualNode(treeB.childNodes[end2])) {
// 			treeA.childNodes[end1].replaceWith(treeB.childNodes[end2].cloneNode(true))
// 			didMutate = true
// 		}
// 		end1--
// 		end2--
// 	}
// 	if (end1 !== start && end2 !== start) {
// 		throw new Error(`FIXME: start=${start} end=${end1} end=${end2}`)
// 	}
// 	// Push extraneous nodes:
// 	if (end1 < end2) {
// 		while (end1 < end2) {
// 			treeA.append(treeB.childNodes[end1].cloneNode(true))
// 			end1++
// 		}
// 		didMutate = true
// 	// Drop extraneous nodes:
// 	} else if (end2 > end1) {
// 		while (end2 > end1) {
// 			treeA.childNodes[end2].remove()
// 			end2--
// 		}
// 		didMutate = true
// 	}
// 	return didMutate
// }

const Paragraph = React.memo(props => (
	<div style={{ whiteSpace: "pre-wrap" }} data-node>
		{props.children || (
			<br />
		)}
	</div>
))

// Parses an array of React components from plain text data.
function parseComponentsFromData(data) {
	const t1 = Date.now()
	const components = []
	const nodes = data.split("\n")
	let index = 0
	while (index < nodes.length) {
		components.push(<Paragraph key={index}>
			{nodes[index]}
		</Paragraph>)
		index++
	}
	const t2 = Date.now()
	if (t2 - t1 >= discTimer.parser) {
		console.log(`parser=${t2 - t1}`)
	}
	return components
}

const KEY_BACKSPACE = "Backspace" // eslint-disable-line no-multi-spaces
const KEY_DELETE    = "Delete"    // eslint-disable-line no-multi-spaces
const KEY_ENTER     = "Enter"     // eslint-disable-line no-multi-spaces
const KEY_TAB       = "Tab"       // eslint-disable-line no-multi-spaces
const KEY_CODE_D    = 68          // eslint-disable-line no-multi-spaces

function isBackspaceRMacOS(e) {
	const ok = (
		platform.isMacOS && // Takes precedence
		!e.shiftKey &&      // Must negate
		e.ctrlKey &&        // Must accept
		!e.altKey &&        // Must negate
		!e.metaKey &&       // Must negate
		e.keyCode === KEY_CODE_D
	)
	return ok
}

function Editor(props) {
	const ref = React.useRef()
	const isPointerDownRef = React.useRef()
	const dedupeCompositionEndRef = React.useRef()

	const [forceRender, setForceRender] = React.useState(false)

	const [state, dispatch] = useEditor(`hello a

hello b

hello c`)

	React.useLayoutEffect(
		React.useCallback(() => {
			const t1 = Date.now()
			ReactDOM.render(state.components, state.reactDOM, () => {
				const t2 = Date.now()
				if (t2 - t1 >= discTimer.render) {
					console.log(`render=${t2 - t1}`)
				}
				// Reset the DOM:
				if (!state.shouldRender) {
					;[...ref.current.childNodes].reverse().map(each => each.remove())
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// NOTE: Gecko/Firefox mysteriously adds up to one
				// <br> after a space
				//
				// https://bugzilla.mozilla.org/show_bug.cgi?id=414223
				// const _t1 = Date.now()
				if (!forceRender && !syncTrees(ref.current, state.reactDOM)) {
					// No-op
					return
				}
				// const _t2 = Date.now()
				// console.log(`append=${_t2 - _t1}`)

				// // Patch the DOM:
				// const _t1 = Date.now()
				// ;[...ref.current.childNodes].reverse().map(each => each.remove()) // TODO
				// ref.current.append(...state.reactDOM.cloneNode(true).childNodes)  // TODO
				// const _t2 = Date.now()
				// console.log(`append=${_t2 - _t1}`)

				// Reset the cursor:
				const t3 = Date.now()
				const selection = document.getSelection()
				const range = document.createRange()
				const { node, offset } = getRangeFromPos(ref.current, state.pos1)
				range.setStart(node, offset)
				range.collapse()
				if (!state.collapsed) {
					const { node, offset } = getRangeFromPos(ref.current, state.pos2) // TODO: Shortcut
					range.setEnd(node, offset)
				}
				selection.removeAllRanges()
				selection.addRange(range)
				const t4 = Date.now()
				if (t4 - t3 >= discTimer.range) {
					console.log(`range=${t4 - t3}`)
				}
				setForceRender(false) // Reset
			})
		}, [forceRender, state]),
		[state.shouldRender],
	)

	// Gets the cursors.
	const getPos = () => {
		const t1 = Date.now()
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		const pos1 = getPosFromRange(ref.current, range.startContainer, range.startOffset)
		let pos2 = pos1
		if (!range.collapsed) {
			pos2 = getPosFromRange(ref.current, range.endContainer, range.endOffset) // TODO: Shortcut
		}
		const t2 = Date.now()
		if (t2 - t1 >= discTimer.pos) {
			console.log(`pos=${t2 - t1}`)
		}
		return [pos1, pos2]
	}

	return (
		<CSSDebugger>
			{React.createElement(
				"div",
				{
					ref,

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: true,

					onFocus: dispatch.actionFocus,
					onBlur:  dispatch.actionBlur,

					onSelect: e => {
						try {
							const selection = document.getSelection()
							const range = selection.getRangeAt(0)
							// NOTE: Select all (e.g. cmd-a or ctrl-a) in
							// Gecko/Firefox selects the root node instead
							// of the innermost start and end nodes
							if (range.startContainer === ref.current || range.endContainer === ref.current) {
								// Iterate to the innermost start node:
								let startNode = ref.current.childNodes[0]
								while (startNode.childNodes.length) {
									startNode = startNode.childNodes[0]
								}
								// Iterate to the innermost end node:
								let endNode = ref.current.childNodes[ref.current.childNodes.length - 1]
								while (endNode.childNodes.length) {
									endNode = endNode.childNodes[endNode.childNodes.length - 1]
								}
								// Reset the range:
								const range = document.createRange()
								// NOTE: setStartBefore and setEndAfter do
								// not work as expected
								range.setStart(startNode, 0)
								range.setEnd(endNode, (endNode.nodeValue || "").length)
								selection.removeAllRanges()
								selection.addRange(range)
							}
							const [pos1, pos2] = getPos()
							dispatch.actionSelect(pos1, pos2)
						} catch (e) {
							console.warn({ onSelect: e })
						}
					},
					onPointerDown: e => {
						isPointerDownRef.current = true
					},
					onPointerMove: e => {
						if (!isPointerDownRef.current) {
							// No-op
							return
						}
						try {
							const [pos1, pos2] = getPos()
							dispatch.actionSelect(pos1, pos2)
						} catch (e) {
							console.warn({ onPointerMove: e })
						}
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					// NOTE: Backspace and delete with modifiers are
					// not well-behaved in Gecko/Firefox; delete word
					// is not well-behaved in Chromium/Chrome
					onKeyDown: e => {
						try {
							const [pos1, pos2] = getPos()
							dispatch.actionSelect(pos1, pos2)
						} catch (e) {
							console.warn({ onKeyDown: e })
						}
						switch (true) {
						case e.key === KEY_TAB:
							e.preventDefault()
							dispatch.tab()
							return
						case e.key === KEY_ENTER:
							e.preventDefault()
							dispatch.enter()
							return
						// FIXME
						case e.key === KEY_BACKSPACE:
							if (state.collapsed && state.pos1 && state.data[state.pos1 - 1] === "\n") {
								e.preventDefault()
								dispatch.backspaceL()
								return
							}
							break
						// FIXME
						case (e.key === KEY_DELETE || isBackspaceRMacOS(e)):
							if (state.collapsed && state.pos1 < state.data.length && state.data[state.pos1] === "\n") {
								e.preventDefault()
								dispatch.backspaceR()
								return
							}
							break
						default:
							// No-op:
							break
						}
					},
					onCompositionEnd: e => {
						// https://github.com/w3c/uievents/issues/202#issue-316461024
						dedupeCompositionEndRef.current = true
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						dispatch.actionInput(data, pos1, pos2)
					},
					onInput: e => {
						if (dedupeCompositionEndRef.current) {
							dedupeCompositionEndRef.current = false // Reset
							return
						}
						if (e.nativeEvent.isComposing) {
							// No-op
							return
						}
						// **DEFEND YOUR KING**
						if (backspaceRe.test(e.nativeEvent.inputType) && state.collapsed && !state.pos1) {
							dispatch.render()
							return
						}
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						dispatch.actionInput(data, pos1, pos2)
					},

					onCut: e => {
						e.preventDefault()
						if (state.collapsed) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", substr)
						dispatch.write("")
					},
					onCopy: e => {
						e.preventDefault()
						if (state.collapsed) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", substr)
					},
					onPaste: e => {
						e.preventDefault()
						const substr = e.clipboardData.getData("text/plain")
						if (!substr) {
							// No-op
							return
						}
						// Use the force, Luke!
						setForceRender(true)
						dispatch.write(substr)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),
				},
			)}
			<div style={stylex.parse("m-t:24")}>
				<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
					{JSON.stringify(
						{
							...state,
							components: undefined,
							reactDOM: undefined,
						},
						null,
						"\t",
					)}
				</pre>
			</div>
		</CSSDebugger>
	)
}

export default Editor
