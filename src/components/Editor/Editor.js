// import getScrollToCoords from "lib/getScrollToCoords"
import DebugEditor from "./DebugEditor"
import keyDown from "./keyDown"
import newGreedyRange from "./helpers/newGreedyRange"
import React from "react"
import ReactDOM from "react-dom"
import StatusBar from "./StatusBar"
import text from "lib/encoding/text"

import {
	// newFPSStyleString,
	// perfParser,
	perfDOMCursor,
	perfDOMRenderer,
	perfReactRenderer,
} from "./__perf"

import {
	innerText,
	isBreakNode,
} from "./nodeFns"

import {
	ascendToDOMNode,
	recurseToDOMCursor,
	recurseToVDOMCursor,
} from "./traverseDOM"

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
			perfReactRenderer.restart()
			ReactDOM.render(<Components components={state.Components} />, state.reactDOM, () => {
				if (!state.shouldRender) {
					ref.current.append(...state.reactDOM.cloneNode(true).childNodes)
					return
				}
				// console.log({
				// 	curr:    [...ref.current.childNodes].map(each => ({ id: each.id, unix: parseInt(each.getAttribute("data-vdom-unix"), 10) })),
				// 	next: [...state.reactDOM.childNodes].map(each => ({ id: each.id, unix: parseInt(each.getAttribute("data-vdom-unix"), 10) })),
				// })

				perfReactRenderer.stop()
				perfDOMRenderer.restart()
				// Eagerly drop range:
				//
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()

				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO

				perfDOMRenderer.stop()
				dispatch.renderDOMCursor()
			})
		}, [state, dispatch]),
		[state.shouldRender],
	)

	// Should render DOM cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.shouldRenderDOMCursor) {
				// No-op.
				return
			}
			perfDOMCursor.restart()
			const selection = document.getSelection()
			const range = document.createRange()
			let { node, offset } = recurseToDOMCursor(ref.current, state.pos1.pos)
			if (isBreakNode(node)) { // (Firefox)
				node = ascendToDOMNode(ref.current, node)
			}
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
			perfDOMCursor.stop()

			// const p = perfParser.duration()
			// const r = perfReactRenderer.duration()
			// const d = perfDOMRenderer.duration()
			// const c = perfDOMCursor.duration()
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

	const seletionchange = React.useRef()
	const greedy = React.useRef()

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.hasFocus) {
				// No-op.
				return
			}
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			if (!anchorNode || !focusNode) {
				// No-op.
				return
			}
			if (
				seletionchange.current                               && // eslint-disable-line
				seletionchange.current.anchorNode   === anchorNode   && // eslint-disable-line
				seletionchange.current.focusNode    === focusNode    && // eslint-disable-line
				seletionchange.current.anchorOffset === anchorOffset && // eslint-disable-line
				seletionchange.current.focusOffset  === focusOffset     // eslint-disable-line
			) {
				// No-op.
				return
			}
			seletionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }
			const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = pos1
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.commitSelect(pos1, pos2)
			greedy.current = newGreedyRange(ref.current, anchorNode, focusNode, pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			{React.createElement(
				"article",
				{
					ref,

					style: {
						paddingBottom: !props.scrollPastEnd
							? 28
							: `calc(100vh - ${Math.floor(19 * 1.5) + 28}px)`,
						transform: state.hasFocus && "translateZ(0px)",
					},

					contentEditable: true,
					suppressContentEditableWarning: true,
					spellCheck: false,

					onFocus: dispatch.commitFocus,
					onBlur:  dispatch.commitBlur,

					onKeyDown: e => {
						switch (true) {
						case keyDown.isEnter(e):
							e.preventDefault()
							dispatch.commitEnter()
							break
						case keyDown.isTab(e):
							e.preventDefault()
							dispatch.commitTab()
							break
						case keyDown.isBackspace(e):
							// Defer to native browser behavior because
							// backspace on emoji is well behaved in
							// Chrome and Safari.
							//
							// NOTE: Firefox (72) does not correctly
							// handle backspace on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos && !text.isTextRange(state.body.data[state.pos1.pos - 1])) {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.commitBackspace()
							break
						case keyDown.isBackspaceWord(e):
							e.preventDefault()
							dispatch.commitBackspaceWord()
							break
						case keyDown.isBackspaceLine(e):
							e.preventDefault()
							dispatch.commitBackspaceLine()
							break
						case keyDown.isDelete(e):
							// Defer to native browser behavior because
							// delete on emoji is well behaved in Chrome
							// and Safari.
							//
							// NOTE: Firefox (72) **does** correctly
							// handle delete on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos < state.body.data.length && !text.isTextRange(state.body.data[state.pos1.pos])) {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.commitDelete()
							break
						case keyDown.isDeleteWord(e):
							e.preventDefault()
							// TODO
							break
						// TODO: Not tested on mobile.
						case keyDown.isUndo(e):
							e.preventDefault()
							dispatch.commitUndo()
							break
						// TODO: Not tested on mobile.
						case keyDown.isRedo(e):
							e.preventDefault()
							dispatch.commitRedo()
							break
						case keyDown.isBold(e):
							e.preventDefault()
							// TODO
							return
						case keyDown.isItalic(e):
							e.preventDefault()
							// TODO
							return
						default:
							// No-op.
						}
						const { anchorNode, focusNode } = document.getSelection()
						if (!anchorNode || !focusNode) {
							// No-op.
							return
						}
						greedy.current = newGreedyRange(ref.current, anchorNode, focusNode, state.pos1, state.pos2)
					},

					onInput: e => {
						const { anchorNode, anchorOffset } = document.getSelection()
						const resetPos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						let data = ""
						let greedyDOMNode = greedy.current.domNodeStart
						while (greedyDOMNode) {
							data += (greedyDOMNode === greedy.current.domNodeStart ? "" : "\n") + innerText(greedyDOMNode)
							if (greedy.current.domNodeRange >= 3 && greedyDOMNode === greedy.current.domNodeEnd) {
								break
							}
							const { nextSibling } = greedyDOMNode
							greedyDOMNode = nextSibling
						}
						dispatch.commitInput(data, greedy.current.pos1.pos, greedy.current.pos2.pos, resetPos)
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
				<DebugEditor />
			)}
		</Provider>
	)
}
