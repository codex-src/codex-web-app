// import getScrollToCoords from "lib/getScrollToCoords"
// import text from "lib/encoding/text"
import DebugCSS from "components/DebugCSS"
import DebugEditor from "./debug/DebugEditor"
import inputType from "./inputType"
import newGreedyRange from "./helpers/greedy"
import onKeyDown from "./onKeyDown"
import React from "react"
import ReactDOM from "react-dom"
import StatusBar from "./components/StatusBar"
import stylex from "stylex"
import { recurseToDOMCursor } from "./data-structures/DOMCursor"

import {
	innerText,
	// isBreakNode,
} from "./data-structures/nodeFunctions"

import {
	ascendToDOMNode,
	recurseToVDOMCursor,
} from "./data-structures/VDOMCursor"

import "./editor.css"

export const Context = React.createContext()

// NOTE: Reference-based components rerender faster than
// anonymous components.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Components(props) {
	return props.components
}

export function Editor({ state, dispatch, ...props }) {
	const ref = React.useRef()

	// Should render (DOM):
	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<Components components={state.Components} />, state.reactDOM, () => {
				if (!state.shouldRender) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// console.log({
				// 	curr:    [...ref.current.childNodes].map(each => ({ id: each.id, unix: parseInt(each.getAttribute("data-vdom-unix"), 10) })),
				// 	next: [...state.reactDOM.childNodes].map(each => ({ id: each.id, unix: parseInt(each.getAttribute("data-vdom-unix"), 10) })),
				// })

				// Eagerly drop range:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()

				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO

				dispatch.renderDOMCursor()
			})
		}, [state, dispatch]),
		[state.shouldRender],
	)

	// Should render DOM cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.shouldRenderDOMCursor) {
				// (No-op)
				return
			}
			const selection = document.getSelection()
			const range = document.createRange()
			let { node, offset } = recurseToDOMCursor(ref.current, state.pos1.pos)
			if (!node) {
				return
			}
			// if (isBreakNode(node)) { // (Firefox)
			// 	node = ascendToDOMNode(ref.current, node)
			// }
			range.setStart(node, offset)
			range.collapse()
			// (Range eagerly dropped)
			selection.addRange(range)
			// // TODO: Idempotent because of native rendering
			// // strategy.
			// const coords = getScrollToCoords({ bottom: 28 })
			// if (coords.y !== -1) {
			// 	window.scrollTo({ to: coords.y, behavior: "smooth" })
			// }

			// const sum = p + r + d + c
			// console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${sum})`, newFPSStyleString(sum))
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	// Start history process (on focus):
	React.useEffect(
		React.useCallback(() => {
			if (!state.hasFocus) {
				return
			}
			const id = setInterval(() => {
				dispatch.storeUndoState()
			}, 1e3)
			return () => {
				setTimeout(() => {
					clearInterval(id)
				}, 1e3)
			}
		}, [state, dispatch]),
		[state.hasFocus],
	)

	const selectionchangeRef = React.useRef()
	const greedyRef = React.useRef()

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.hasFocus) {
				// (No-op)
				return
			}
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			if (!anchorNode || !focusNode) {
				// (No-op)
				return
			}
			// // TODO
			// const { current } = selectionchangeRef
			if (
				selectionchangeRef.current                               && // eslint-disable-line
				selectionchangeRef.current.anchorNode   === anchorNode   && // eslint-disable-line
				selectionchangeRef.current.focusNode    === focusNode    && // eslint-disable-line
				selectionchangeRef.current.anchorOffset === anchorOffset && // eslint-disable-line
				selectionchangeRef.current.focusOffset  === focusOffset     // eslint-disable-line
			) {
				// (No-op)
				return
			}
			selectionchangeRef.current = { anchorNode, anchorOffset, focusNode, focusOffset }
			const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = pos1
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.commitSelect(pos1, pos2)
			greedyRef.current = newGreedyRange("selectionchange", ref.current, anchorNode, focusNode, pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	const { Provider } = Context
	return (
		<DebugCSS>
			<Provider value={[state, dispatch]}>
				{React.createElement(
					"article",
					{
						ref,

						style: {
							paddingBottom: props.scrollPastEnd && `calc(100vh - ${Math.floor(19 * 1.5) + 28}px)`,
							// paddingBottom: props.statusBar && 28,
							transform: state.hasFocus && "translateZ(0px)",
						},

						contentEditable: true,
						suppressContentEditableWarning: true,
						spellCheck: false,

						onFocus: dispatch.commitFocus,
						onBlur:  dispatch.commitBlur,

						onKeyDown: e => {
							switch (true) {
							case onKeyDown.isBackspaceClass(e):
								// Guard the anchor node:
								if (state.pos1.pos === state.pos2.pos && (!state.pos1.pos || state.body.data[state.pos1.pos - 1] === "\n")) {
									e.preventDefault()
									dispatch.commitBackspace()
									return
								}
								// (No-op)
								break
							case onKeyDown.isDeleteClass(e):
								// Guard the anchor node:
								if (state.pos1.pos === state.pos2.pos && (state.pos1.pos === state.body.data.length || state.body.data[state.pos1.pos] === "\n")) {
									e.preventDefault()
									dispatch.commitDelete()
									return
								}
								// (No-op)
								break
							case onKeyDown.isBold(e):
								e.preventDefault()
								return
							case onKeyDown.isItalic(e):
								e.preventDefault()
								return
							default:
								// (No-op)
								break
							}
							const { anchorNode, focusNode } = document.getSelection()
							if (!anchorNode || !focusNode) {
								// (No-op)
								return
							}
							// console.log({ debugFrom: "onSelect", rootNode: ref.current, anchorNode, focusNode, pos1: state.pos1, pos2: state.pos2 })
							greedyRef.current = newGreedyRange("onKeyDown", ref.current, anchorNode, focusNode, state.pos1, state.pos2)
						},

						onInput: e => {
							const greedy = greedyRef.current
							const { anchorNode, anchorOffset } = document.getSelection()
							const currentDOMNode = ascendToDOMNode(ref.current, anchorNode)
							const resetPos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)

							switch (true) {
							case inputType.isHistoryUndo(e):
								dispatch.commitUndo()
								return
							case inputType.isHistoryRedo(e):
								dispatch.commitRedo()
								return
							// Insert paragraph when typing:
							case inputType.isInsertText(e) && currentDOMNode !== greedy.currentDOMNode: { // (Add scope)
								const p1 = `${innerText(greedy.currentDOMNode)}\n`
								const p2 = `${innerText(currentDOMNode)}\n`
								dispatch.greedyWrite(p1 + p2, resetPos.pos - p1.length, resetPos.pos + p2.length - 1, resetPos)
								return
							}
							case inputType.isInsertParagraph(e):
								dispatch.commitEnter()
								return
							default:
								// (No-op)
								break
							}

							let data = ""
							let currentNode = greedy.domNodeStart
							while (currentNode) {
								data += (currentNode === greedy.domNodeStart ? "" : "\n") + innerText(currentNode)
								if (greedy.domNodeRange >= 3 && currentNode === greedy.domNodeEnd) {
									break
								}
								const { nextSibling } = currentNode
								currentNode = nextSibling
							}
							dispatch.commitInput(data, greedy.pos1, greedy.pos2, resetPos)
						},

						onCut: e => {
							e.preventDefault()
							const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
							if (data) {
								e.clipboardData.setData("text/plain", data)
							}
							dispatch.commitCut()
						},

						onCopy: e => {
							e.preventDefault()
							const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
							if (data) {
								e.clipboardData.setData("text/plain", data)
							}
							dispatch.commitCopy()
						},

						onPaste: e => {
							e.preventDefault()
							const data = e.clipboardData.getData("text/plain")
							dispatch.commitPaste(data)
						},

						onDragStart: e => e.preventDefault(),
						onDrop:      e => e.preventDefault(),
					},
				)}
				{/* {state.Components} */}
				{props.statusBar && (
					<StatusBar />
				)}
				{props.debug && (
					<React.Fragment>
						<div style={stylex.parse("h:28")} />
						<DebugEditor />
					</React.Fragment>
				)}
			</Provider>
		</DebugCSS>
	)
}
