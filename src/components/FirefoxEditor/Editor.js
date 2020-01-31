import CSSDebugger from "utils/CSSDebugger"
import Enum from "utils/Enum"
import platform from "utils/platform"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"

import "./Editor.css"

const DISC_TIMER_POS_MAX  = 5 // eslint-disable-line no-multi-spaces
const DISC_TIMER_DATA_MAX = 5 // eslint-disable-line no-multi-spaces

const ActionTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"INPUT",
)

// TODO: nodes?
const initialState = {
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
		const actionTimeStamp = Date.now()
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
	actionInputDropBytes(dropL, dropR) {
		if (!state.collapsed) {
			dropL = 0
			dropR = 0
		}
		const data = state.data.slice(0, state.pos1 - dropL) + state.data.slice(state.pos2 + dropR)
		const pos1 = state.pos1 - dropL
		const pos2 = pos1
		this.actionInput(data, pos1, pos2)
	},
	backspaceL() {
		this.actionInputDropBytes(1, 0)
	},
	backspaceR() {
		this.actionInputDropBytes(0, 1)
	},
	render() {
		state.components = parseComponents(state.data)
		state.shouldRender++
	},
})

const init = initialValue => initialState => ({
	...initialState,
	actionType: ActionTypes.INIT,
	actionTimeStamp: Date.now(),
	data: initialValue,
	components: parseComponents(initialValue),
	reactDOM: document.createElement("div"),
})

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

// Gets cursors from a range.
function getPosFromRange(rootNode, node, offset) {
	const t1 = Date.now()
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
	const t2 = Date.now()
	if (t2 - t1 >= DISC_TIMER_POS_MAX) {
		console.warn(`getPosFromRange=${t2 - t1}`)
	}
	return pos
}

// Gets (recursively reads) data from a root node.
//
// TODO: Is arr.join("\n") faster?
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
	if (t2 - t1 >= DISC_TIMER_DATA_MAX) {
		console.warn(`getData=${t2 - t1}`)
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

// Compares whether two DOM trees are equal -- root nodes
// **are not** compared.
function areEqualTrees(treeA, treeB) {
	if (treeA.childNodes.length !== treeB.childNodes.length) {
		return false
	}
	let index = 0
	while (index < treeA.childNodes.length) {
		if (!treeA.childNodes[index].isEqualNode(treeB.childNodes[index])) {
			console.log(treeA.childNodes[index].outerHTML, treeB.childNodes[index].outerHTML)
			return false
		}
		index++
	}
	return true
}

const Paragraph = props => (
	<div id={props.reactKey} data-node>
		{props.children || (
			<br />
		)}
	</div>
)

const key = index => ({
	key: index,
	reactKey: index,
})

function parseComponents(data) {
	const components = data.split("\n").map((each, index) => (
		<Paragraph { ...key(index) }>
			{each}
		</Paragraph>
	))
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

function FirefoxEditorComponents(props) {
	return props.components
}

function FirefoxEditor(props) {
	const ref = React.useRef()
	const isPointerDownRef = React.useRef()
	const FFDedupeCompositionEndRef = React.useRef()

	const [state, dispatch] = useEditor(`Hello

Hello

Hello`)

	React.useLayoutEffect(
		React.useCallback(() => {
			// TODO: Try ReactDOM.render(state.components, state.reactDOM, () => { ... })
			ReactDOM.render(<FirefoxEditorComponents components={state.components} />, state.reactDOM, () => {
				if (!state.shouldRender) {
					// ;[...ref.current.childNodes].map(each => each.remove())
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// const selection = document.getSelection()
				// selection.removeAllRanges()

				// NOTE: Gecko/Firefox mysteriously adds up to one
				// <br> after a space
				if (areEqualTrees(ref.current, state.reactDOM)) {
					// No-op
					console.log("a")
					return
				}
				console.log("b")

				;[...ref.current.childNodes].map(each => each.remove())
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

				const { node, offset } = getRangeFromPos(ref.current, state.pos1) // FIXME: state.pos2?
				const selection = document.getSelection()
				const range = document.createRange()
				range.setStart(node, offset)
				range.collapse()
				selection.removeAllRanges()
				selection.addRange(range)
			})
		}, [state]),
		[state.shouldRender],
	)

	// Gets the cursors.
	const getPos = () => {
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		const pos1 = getPosFromRange(ref.current, range.startContainer, range.startOffset)
		let pos2 = pos1
		if (!range.collapsed) {
			pos2 = getPosFromRange(ref.current, range.endContainer, range.endOffset)
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

					onFocus: e => {
						dispatch.actionFocus()
					},
					onBlur: e => {
						dispatch.actionBlur()
					},

					onSelect: e => {
						try {
							const selection = document.getSelection()
							const range = selection.getRangeAt(0)
							// NOTE: Select all (e.g. cmd-a or ctrl-a) in
							// Gecko/Firefox selects the root node instead
							// of the innermost start and end nodes
							if (range.commonAncestorContainer === ref.current) {
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
								// NOTE: setStartBefore and setEndAfter do not
								// work as expected
								range.setStart(startNode, 0)
								range.setEnd(endNode, (endNode.nodeValue || "").length)
								selection.removeAllRanges()
								selection.addRange(range)
							}
							const [pos1, pos2] = getPos()
							dispatch.actionSelect(pos1, pos2)
						} catch (e) {
							console.warn(e)
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
						const [pos1, pos2] = getPos()
						dispatch.actionSelect(pos1, pos2)
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					// NOTE: Backspace and delete (incl. modifiers)
					// are not well-behaved in Gecko/Firefox
					onKeyDown: e => {
						try {
							const [pos1, pos2] = getPos()
							dispatch.actionSelect(pos1, pos2)
						} catch (e) {
							console.warn(e)
						}

						switch (true) {
						case e.key === KEY_TAB:
							// Defer to onInput:
							e.preventDefault()
							document.execCommand("insertText", null, "\t")
							return
						case e.key === KEY_ENTER:
							// Defer to onInput:
							e.preventDefault()
							document.execCommand("insertParagraph", null, false)
							return
						case e.key === KEY_BACKSPACE:
							if (state.collapsed && state.pos1 && state.data[state.pos1 - 1] === "\n") {
								e.preventDefault()
								dispatch.backspaceL()
								return
							}
							break
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
						FFDedupeCompositionEndRef.current = true
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						dispatch.actionInput(data, pos1, pos2)
					},
					onInput: e => {
						if (FFDedupeCompositionEndRef.current) {
							FFDedupeCompositionEndRef.current = false // Reset
							return
						}
						if (e.nativeEvent.isComposing) {
							// No-op
							return
						}
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						dispatch.actionInput(data, pos1, pos2)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),

					// ...
				},
			)}
			<div style={stylex.parse("m-t:24")}>
				<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
					{JSON.stringify(
						{
							...state,

							components: undefined,
							reactDOM:   undefined,
						},
						null,
						"\t",
					)}
				</pre>
			</div>
		</CSSDebugger>
	)
}

export default FirefoxEditor
