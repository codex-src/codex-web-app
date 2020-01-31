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
	reset: null,
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
	actionInput(data, pos1, pos2, reset) {
		this.newAction(ActionTypes.INPUT)
		Object.assign(state, { data, pos1, pos2, reset })
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
	reset: {
		id: "",
		textOffset: 0,
	},
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

// Gets the text offset from a (of a) range; code based on
// getPosFromRange.
function getTextOffsetFromRange(rootNode, node, offset) {
	let textOffset = 0
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			if (childNodes[index] === node) {
				textOffset += offset
				return true
			}
			textOffset += (childNodes[index].nodeValue || "").length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.hasAttribute("data-node")) {
				textOffset++
			}
			index++
		}
		return false
	}
	recurse(rootNode)
	return textOffset
}

// Gets the range from a text offset; code based on
// getPosFromRange.
function getRangeFromTextOffset(rootNode, textOffset) {
	let node = null
	let offset = 0
	const recurse = startNode => {
		const { childNodes } = startNode
		let index = 0
		while (index < childNodes.length) {
			const { length } = childNodes[index].nodeValue || ""
			if (textOffset - length <= 0) {
				node = childNodes[index] // Set
				offset = textOffset      // Reset
				return true
			}
			textOffset -= length
			if (recurse(childNodes[index])) {
				return true
			}
			const { nextSibling } = childNodes[index]
			if (nextSibling && nextSibling.hasAttribute("data-node")) {
				textOffset--
			}
			index++
		}
		return false
	}
	recurse(rootNode)
	return { node, offset }
}

// // Gets a range for a key node and offset.
// function getRangeFromKeyNodeAndOffset(keyNode, offset) {
// 	const range = {
// 		node: null,
// 		offset: 0,
// 	}
// 	const recurseOn = startNode => {
// 		for (const currentNode of startNode.childNodes) {
// 			if (isTextOrBreakNode(currentNode)) {
// 				// If found, return:
// 				const { length } = nodeValue(currentNode)
// 				if (offset - length <= 0) {
// 					Object.assign(range, {
// 						node: currentNode,
// 						offset,
// 					})
// 					return true
// 				}
// 				offset -= length
// 			} else {
// 				// If found recursing on the current node, return:
// 				if (recurseOn(currentNode)) {
// 					return true
// 				}
// 			}
// 		}
// 		return false
// 	}
// 	recurseOn(keyNode)
// 	return range
// }

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
				;[...ref.current.childNodes].map(each => each.remove())
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes)

				const rootNode = document.getElementById(state.reset.id) // FIXME: Compound components
				const { node, offset } = getRangeFromTextOffset(rootNode, state.reset.textOffset)

				const selection = document.getSelection()
				const range = document.createRange()
				range.setStart(node, offset)
				range.collapse() // FIXME: range.setEnd(...)
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

	// Gets the reset (ID and text offset).
	const getReset = () => {
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		let node = range.startContainer
		while (node) {
			if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("data-node")) {
				break
			}
			node = node.parentNode
		}
		const { id } = node
		const textOffset = getTextOffsetFromRange(node, range.startContainer, range.startOffset)
		return { id, textOffset }
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
						const selection = document.getSelection()
						const range = selection.getRangeAt(0)
						// NOTE: Select all (command-a or control-a) in
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

					onKeyDown: e => {
						const [pos1, pos2] = getPos()
						dispatch.actionSelect(pos1, pos2)

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
						FFDedupeCompositionEndRef.current = true
					},
					onInput: e => {
						// https://github.com/w3c/uievents/issues/202#issue-316461024
						if (FFDedupeCompositionEndRef.current) {
							FFDedupeCompositionEndRef.current = false // Reset
							return
						}
						const data = getData(ref.current)
						const [pos1, pos2] = getPos()
						const reset = getReset()
						dispatch.actionInput(data, pos1, pos2, reset)
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
