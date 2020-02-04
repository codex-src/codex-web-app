import CSSDebugger from "utils/CSSDebugger"
import emoji from "emoji-trie"
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
	epoch: 0,           // The epoch (time stamp) of the editor
	actionType: "",     // The type of the current action
	actionTimeStamp: 0, // The time stamp (since epoch) of the current action
	focused: false,     // Is the editor focused?
	data: "",           // The plain text data
	pos1: 0,            // The start cursor
	pos2: 0,            // The end cursor
	coords: null,       // The cursor coords
	atStart: false,     // Are the cursors exclusively at the start?
	atEnd: false,       // Are the cursors exclusively at the end?
	collapsed: false,   // Are the cursors collapsed?
	components: null,   // The React components
	shouldRender: 0,    // Should render the DOM and or cursor?
	reactDOM: null,     // The React DOM (not what the user sees)
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
		const atStart = collapsed && !pos1
		const atEnd = collapsed && pos1 === state.data.length
		Object.assign(state, { pos1, pos2, coords, atStart, atEnd, collapsed })
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
		this.actionInput(data, pos1, pos2, state.coords) // Synthetic coords
	},
	backspaceRuneL() {
		let dropL = 0
		if (state.collapsed && !state.atStart) {
			// Get the rune at the end:
			const substr = state.data.slice(0, state.pos1)
			let rune = emoji.atEnd(substr)
			if (!rune) {
				rune = utf8.atEnd(substr)
			}
			dropL = rune.length
		}
		this.write("", dropL, 0)
	},
	backspaceWordL() {
		if (!state.collapsed || state.atStart) {
			this.write("", 0, 0)
			return
		}
		// Iterate (h.) white space:
		let index = state.pos1
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate non-word runes:
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate word runes:
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceLineL() {
		if (!state.collapsed || state.atStart) {
			this.write("", 0, 0)
			return
		}
		let index = state.pos1
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceRuneR() {
		let dropR = 0
		if (state.collapsed && !state.atEnd) {
			// Get the rune at the start:
			const substr = state.data.slice(state.pos1)
			let rune = emoji.atStart(substr)
			if (!rune) {
				rune = utf8.atStart(substr)
			}
			dropR = rune.length
		}
		this.write("", 0, dropR)
	},
	backspaceWordR() {
		if (!state.collapsed || state.atEnd) {
			this.write("", 0, 0)
			return
		}
		// Iterate (h.) white space:
		let index = state.pos1
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (!utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Iterate non-word runes:
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Iterate word runes:
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Get the number of bytes to drop:
		let dropR = index - state.pos1
		if (!dropR && state.data[index] === "\n") {
			dropR = 1
		}
		this.write("", 0, dropR)
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
		if (!substr) {
			// No-op
			return
		}
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

// Gets plain text data; recursively reads from a root node.
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

// NOTE: Gecko/Firefox needs white-space: pre-wrap to be an
// inline style
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

// TODO
//
// - Undo
// - Redo
// - Components
// - localStorage
// - Demo
// - etc.
//
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
				// Sync the user DOM to the React DOM:
				const syncT1 = Date.now()
				const mutations = syncTrees(ref.current, state.reactDOM)
				if (!state.shouldRender || !mutations) {
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
					// TODO: Add state.pos1 as a shortcut
					const { node, offset } = getRangeFromPos(ref.current, state.pos2)
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

	// Gets the cursors (and coords).
	const getPos = () => {
		const t1 = Date.now()
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		const pos1 = getPosFromRange(ref.current, range.startContainer, range.startOffset)
		let pos2 = pos1
		if (!range.collapsed) {
			// TODO: Add state.pos1 as a shortcut
			pos2 = getPosFromRange(ref.current, range.endContainer, range.endOffset)
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
						const [pos1, pos2, coords] = getPos()
						dispatch.actionInput(data, pos1, pos2, coords)
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
						//
						// NOTE: deleteSoftLineForward and
						// deleteHardLineForward are not supported
						switch (e.nativeEvent.inputType) {
						case "insertLineBreak": // Soft enter
						case "insertParagraph":
							dispatch.enter()
							return
						case "deleteContentBackward":
							dispatch.backspaceRuneL()
							return
						case "deleteWordBackward":
							dispatch.backspaceWordL()
							return
						case "deleteSoftLineBackward":
						case "deleteHardLineBackward":
							dispatch.backspaceLineL()
							return
						case "deleteContentForward":
							dispatch.backspaceRuneR()
							return
						case "deleteWordForward":
							dispatch.backspaceWordR()
							return
						default:
							// No-op
							break
						}
						// Input:
						const data = getData(ref.current)
						const [pos1, pos2, coords] = getPos()
						dispatch.actionInput(data, pos1, pos2, coords)
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
