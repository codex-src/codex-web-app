import CSSDebugger from "utils/CSSDebugger"
import emojiTrie from "emoji-trie"
import Enum from "utils/Enum"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useMethods from "use-methods"
import utf8 from "utils/encoding/utf8"
import { syncTrees } from "./syncTrees"

import "./Editor.css"

const KEY_CODE_TAB = 9

// Discretionary timers (16.5ms -> 33ms)
const discTimer = {
	data:   2 * 2,   // data=x
	pos:    2 * 2,   // pos=x
	parser: 2 * 3.5, // parser=x
	render: 2 * 3.5, // render=x
	sync:   2 * 3.5, // sync=x
	range:  2 * 2,   // range=x
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
	coords: null,
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
	actionSelect(pos1, pos2, coords) {
		this.newAction(ActionTypes.SELECT)
		const collapsed = pos1 === pos2
		Object.assign(state, { pos1, pos2, coords, collapsed })
	},
	actionInput(data, pos1, pos2, coords = state.coords) {
		this.newAction(ActionTypes.INPUT)
		Object.assign(state, { data, pos1, pos2, coords })
		this.render()
	},
	write(substr, dropL = 0, dropR = 0) { // dropL and dropR are expected to be >= 0
		const data = state.data.slice(0, state.pos1 - dropL) + substr + state.data.slice(state.pos2 + dropR)
		const pos1 = state.pos1 - dropL + substr.length
		const pos2 = pos1
		this.actionInput(data, pos1, pos2)
	},
	backspaceCharL() {
		let dropL = 0
		if (state.collapsed && state.pos1) {
			const emoji = emojiTrie.atEnd(state.data.slice(0, state.pos1))
			dropL = emoji.length || 1
		}
		this.write("", dropL, 0)
	},
	backspaceWordL() {
		if (!state.collapsed || !state.pos1) {
			this.write("", 0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1
		while (index) {
			const rune = utf8.endRune(state.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate non-word characters:
		while (index) {
			const rune = utf8.endRune(state.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate word characters:
		while (index) {
			const rune = utf8.endRune(state.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				break
			}
			index -= rune.length
		}
		const dropL = state.pos1 - index || 1
		this.write("", dropL, 0)
	},
	backspaceLineL() {
		if (!state.collapsed || !state.pos1) {
			this.write("", 0, 0)
			return
		}
		let index = state.pos1
		while (index) {
			const rune = utf8.endRune(state.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		const dropL = state.pos1 - index || 1
		this.write("", dropL, 0)
	},
	backspaceCharR() {
		let dropR = 0
		if (state.collapsed && state.pos1 < state.data.length) {
			const emoji = emojiTrie.atStart(state.data.slice(state.pos1))
			dropR = emoji.length || 1
		}
		this.write("", 0, dropR)
	},
	backspaceWordR() {
		// TODO
	},
	backspaceLineR() {
		// TODO
	},
	tab() {
		this.write("\t")
	},
	enter() {
		this.write("\n")
	},
	cut() {
		this.write("")
	},
	paste(substr) {
		this.write(substr)
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
		coords: {
			pos1: {
				x: 0,
				y: 0,
			},
			pos2: {
				x: 0,
				y: 0,
			},
		},
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

// Gets coords from a range.
function getCoordsFromRange(range) {
	const { left, right, top, bottom } = range.getBoundingClientRect()
	if (!left && !right && !top && !bottom) {
		let { startContainer, endContainer } = range
		// Get the innermost start node (element):
		while (startContainer.children.length) {
			startContainer = startContainer.children[0]
		}
		// Get the innermost end node (element):
		while (endContainer.children.length) {
			endContainer = endContainer.children[0]
		}
		const start = startContainer.getClientRects()[0]
		const end = endContainer.getClientRects()[0]
		const pos1 = { x: start.left, y: start.top }
		const pos2 = { x: end.right, y: end.bottom }
		return { pos1, pos2 }
	}
	const pos1 = { x: left, y: top }
	const pos2 = { x: right, y: bottom }
	return { pos1, pos2 }
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

// NOTE: Gecko/Firefox needs white-space: pre-wrap to use
// inline-styles
//
// overflowWrap: "break-word",
const preWrap = { whiteSpace: "pre-wrap" }

const Paragraph = React.memo(props => (
	<div style={preWrap} data-node>
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
	for (let index = 0; index < nodes.length; index++) {
		components.push(<Paragraph key={index}>{nodes[index]}</Paragraph>)
	}
	const t2 = Date.now()
	if (t2 - t1 >= discTimer.parser) {
		console.log(`parser=${t2 - t1}`)
	}
	return components
}

function Editor(props) {
	const ref = React.useRef()
	const isPointerDownRef = React.useRef()
	const dedupeCompositionEndRef = React.useRef()

	const [state, dispatch] = useEditor(`hello

hello hello 🙋🏿‍♀️🙋🏿‍♀️🙋🏿‍♀️ 🙋🏿‍♀️🙋🏿‍♀️🙋🏿‍♀️

hello`)

	React.useLayoutEffect(
		React.useCallback(() => {
			const renderT1 = Date.now()
			ReactDOM.render(state.components, state.reactDOM, () => {
				const renderT2 = Date.now()
				if (renderT2 - renderT1 >= discTimer.render) {
					console.log(`render=${renderT2 - renderT1}`)
				}
				// Reset the DOM (once):
				if (!state.shouldRender) {
					syncTrees(ref.current, state.reactDOM)
					return
				}
				// Patch the DOM:
				const syncT1 = Date.now()
				const mutations = syncTrees(ref.current, state.reactDOM)
				if (!mutations) {
					// No-op
					return
				}
				const syncT2 = Date.now()
				if (syncT2 - syncT1 >= discTimer.sync) {
					console.log(`sync=${syncT2 - syncT1} (${mutations} mutations)`)
				}
				// Reset the cursor:
				const rangeT1 = Date.now()
				const selection = document.getSelection()
				const range = document.createRange()
				const { node, offset } = getRangeFromPos(ref.current, state.pos1)
				range.setStart(node, offset)
				range.collapse()
				if (!state.collapsed) {
					const { node, offset } = getRangeFromPos(ref.current, state.pos2) // TODO: Shortcut
					range.setEnd(node, offset)
				}
				selection.addRange(range)
				const rangeT2 = Date.now()
				if (rangeT2 - rangeT1 >= discTimer.range) {
					console.log(`cursor=${rangeT2 - rangeT1}`)
				}
			})
		}, [state]),
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
		const coords = getCoordsFromRange(range)
		return [pos1, pos2, coords]
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
							const [pos1, pos2, coords] = getPos()
							dispatch.actionSelect(pos1, pos2, coords)
						} catch (e) {
							console.warn({ "onSelect/catch": e })
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
							const [pos1, pos2, coords] = getPos()
							dispatch.actionSelect(pos1, pos2, coords)
						} catch (e) {
							console.warn({ "onPointerMove/catch": e })
						}
					},
					onPointerUp: e => {
						isPointerDownRef.current = false
					},

					// // Guard the contenteditable node (root node):
					// if (backspaceRe.test(e.nativeEvent.inputType) && state.collapsed && !state.pos1) {
					// 	dispatch.render()
					// 	return
					// }

					onKeyDown: e => {
						switch (true) {
						case e.keyCode === KEY_CODE_TAB:
							e.preventDefault()
							dispatch.tab()
							return
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
						dispatch.actionInput(data, pos1, pos2) // No coords
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
						// https://w3.org/TR/input-events-2/#interface-InputEvent-Attributes
						switch (e.nativeEvent.inputType) {
						case "insertLineBreak": // Soft enter
						case "insertParagraph": // Enter
							dispatch.enter()
							return
						// Backspace (backwards):
						case "deleteContentBackward":
							dispatch.backspaceCharL()
							return
						case "deleteWordBackward":
							dispatch.backspaceWordL()
							return
						case "deleteSoftLineBackward":
						case "deleteHardLineBackward":
							dispatch.backspaceLineL()
							return
						// Backspace (forwards):
						case "deleteContentForward":
							dispatch.backspaceCharR()
							return
						case "deleteWordForward":
							dispatch.backspaceWordR()
							return
						case "deleteSoftLineForward":
						case "deleteHardLineForward":
							dispatch.backspaceLineR()
							return
						default:
							// No-op
							break
						}
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						dispatch.actionInput(data, pos1, pos2) // No coords
					},

					onCut: e => {
						e.preventDefault()
						if (state.collapsed) {
							// No-op
							return
						}
						const substr = state.data.slice(state.pos1, state.pos2)
						e.clipboardData.setData("text/plain", substr)
						dispatch.cut()
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
						// if (!substr) {
						// 	// No-op
						// 	return
						// }
						dispatch.paste(substr)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),
				},
			)}
			{true && (
				<div style={stylex.parse("m-t:24")}>
					<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
						{JSON.stringify(
							{
								...state,
								length: state.data.length,
								components: undefined,
								reactDOM: undefined,
							},
							null,
							"\t",
						)}
					</pre>
				</div>
			)}
		</CSSDebugger>
	)
}

export default Editor
