import CSSDebugger from "utils/CSSDebugger"
import Enum from "utils/Enum"
import platform from "utils/platform"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"

import "./Editor.css"

const ActionTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
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
}

// const EPOCH = Date.now()

const reducer = state => ({
	newAction(actionType) {
		const actionTimeStamp = Date.now() // - EPOCH
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
})

const init = initialValue => initialState => {
	const state = {
		...initialState,
		actionType: ActionTypes.INIT,
		actionTimeStamp: Date.now(),
		data: initialValue,
		components: parseComponents(initialValue),
	}
	return state
}

// Gets cursors from a range.
//
// const t1 = Date.now()
// const t2 = Date.now()
// console.log(`getPosFromRange=${t2 - t1}`)
//
function getPosFromRange(rootNode, node, offset) {
	let pos = 0
	const recurse = startNode => {
		const { childNodes } = startNode // Faster access
		const { length } = childNodes    // Faster access
		let index = 0
		while (index < length) {
			if (childNodes[index] === node) {
				pos += offset
				return true
			}
			pos += (childNodes[index].nodeValue || "").length
			if (recurse(childNodes[index])) {
				return true
			}
			const next = childNodes[index].nextSibling
			pos += next && next.hasAttribute("data-node")
			index++
		}
		return false
	}
	recurse(rootNode)
	return pos
}

// function parseNodes(data) {
// 	const nodes = data.split("\n").map(each => ({
// 		key: random.newUUID(),
// 		data: each,
// 	}))
// 	return nodes
// }

const Paragraph = props => (
	<div data-node>
		{props.children || (
			<br />
		)}
	</div>
)

function parseComponents(data) {
	const components = data.split("\n").map((each, index) => (
		<Paragraph key={index}>
			{each}
		</Paragraph>
	))
	return components
}

const KEY_BACKSPACE = "Backspace" // eslint-disable-line no-multi-spaces
const KEY_DELETE    = "Delete"    // eslint-disable-line no-multi-spaces
const KEY_CODE_D    = 68          // eslint-disable-line no-multi-spaces

function isControlDMacOS(e) {
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

function FirefoxEditor(props) {
	const rootNodeRef = React.useRef()
	const isPointerDownRef = React.useRef()
	const FFDedupeCompositionEndRef = React.useRef()

	const [state, dispatch] = useMethods(reducer, initialState, init(`Hello, world! 1

Hello, world! 2

Hello, world! 3`))

	// Gets cursors.
	//
	// TODO: getPosFromRange?
	const getPos = () => {
		const selection = document.getSelection()
		const range = selection.getRangeAt(0)
		const pos1 = getPosFromRange(rootNodeRef.current, range.startContainer, range.startOffset)
		let pos2 = pos1
		if (!range.collapsed) {
			pos2 = getPosFromRange(rootNodeRef.current, range.endContainer, range.endOffset)
		}
		return [pos1, pos2]
	}

	return (
		<CSSDebugger>
			{React.createElement(
				"div",
				{
					ref: rootNodeRef,

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
						if (range.commonAncestorContainer === rootNodeRef.current) {
							// Iterate to the innermost start node:
							let startNode = rootNodeRef.current.childNodes[0]
							while (startNode.childNodes.length) {
								startNode = startNode.childNodes[0]
							}
							// Iterate to the innermost end node:
							let endNode = rootNodeRef.current.childNodes[rootNodeRef.current.childNodes.length - 1]
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
						case e.key === KEY_BACKSPACE:
							if (state.collapsed && state.pos1 && state.data[state.pos1 - 1] === "\n") {
								e.preventDefault()
								// TODO
								return
							}
							break
						case (e.key === KEY_DELETE || isControlDMacOS(e)):
							if (state.collapsed && state.pos1 < state.data.length && state.data[state.pos1] === "\n") {
								e.preventDefault()
								// TODO
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
						// console.log(e.nativeEvent)
					},

					onDrag: e => e.preventDefault(),
					onDrop: e => e.preventDefault(),

					// ...
				},
				state.components,
			)}
			<div style={stylex.parse("m-t:24")}>
				<pre style={{ ...stylex.parse("pre-wrap fs:12 lh:125%"), MozTabSize: 2, tabSize: 2 }}>
					{JSON.stringify(
						{
							...state,
							components: undefined,
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
