// import CSSDebugger from "utils/CSSDebugger"
import ActionTypes from "./ActionTypes"
import Debugger from "./Debugger"
import onKeyDown from "./onKeyDown"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"

const Context = React.createContext()

function TextareaComponents(props) {
	return props.components
}

// TODO:
//
// - Text components
// - Preview mode (rename from read-only mode)
// - Support for StatusBar
// - Parse Unicode horizontal spaces?
// - Parse emoji?
// - Preview components
// - HTML components
//
function TextareaEditor(props) {
	const reactDOM = React.useRef()
	const pre = React.useRef()
	const span = React.useRef()
	const textarea = React.useRef()

	const isPointerDown = React.useRef()

	// const [state, dispatch] = useTextareaEditor(props.initialValue)
	const [state, dispatch] = useTextareaEditor(`hello

\`\`\`hello\`\`\`

\`\`\`
hello
\`\`\`

hello`)

	// Set textarea initial value:
	//
	// https://github.com/facebook/react/issues/8514
	React.useLayoutEffect(
		React.useCallback(() => {
			textarea.current.value = state.data
		}, [state]),
		[],
	)

	// Set textarea height:
	React.useLayoutEffect(() => {
		const { height } = pre.current.getBoundingClientRect()
		textarea.current.style.height = `${height}px`
	}, [state.data])

	// Update coords **after** updating pos1 and pos2:
	React.useEffect( // TODO: useLayoutEffect?
		React.useCallback(() => {
			const rects = span.current.getClientRects()
			const start = rects[0]
			const end = rects[rects.length - 1]
			const coords = {
				pos1: { x: start.left, y: start.top },
				pos2: { x: end.right, y: end.bottom },
			}
			dispatch.select(state.pos1, state.pos2, coords)
		}, [state, dispatch]),
		[state.pos1, state.pos2],
	)

	// Should render React components:
	React.useEffect( // TODO: useLayoutEffect?
		React.useCallback(() => {
			// const t1 = Date.now()
			ReactDOM.render(<TextareaComponents components={state.components} />, reactDOM.current, () => {
				// const t2 = Date.now()
				// console.log(`render=${t2 - t1}`)
			})
		}, [state]),
		[state.shouldRender],
	)

	// React.useLayoutEffect(() => {
	// 	// TODO: scrollIntoViewIfNeeded
	// 	const pos1 = state.coords.pos1.y
	// 	const pos2 = state.coords.pos1.y
	// 	const { scrollY, innerHeight } = window
	// 	// if (scrollY < innerHeight + pos1) {
	// 	// 	console.log("a")
	// 	// } else (scrollY > innerHeight + pos2) {
	// 	// 	console.log("b")
	// 	// }
	// 	// if (window.scrollY > bounds.t) {
	// 	// 	coords.y = bounds.t
	// 	// } else if (window.scrollY < bounds.b) {
	// 	// 	coords.y = bounds.b
	// 	// }
	// 	console.log({ pos1, pos2, scrollY, innerHeight })
	// }, [state.coords])

	const { Provider } = Context
	return (
		// <CSSDebugger>
		<Provider value={[state, dispatch]}>
			{/* <div style={stylex.parse("m-x:-32 p-x:32 p-y:16 b:gray-50 br:8")}> */}
			<article style={stylex.parse("relative")}>
				{/* reactDOM: */}
				<pre ref={reactDOM} style={stylex.parse("no-pointer-events")} />
				{/* pre: */}
				<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), visibility: "hidden" }}>
					<pre ref={pre} style={stylex.parse("c:blue -a:10%")}>
						{state.data.slice(0, state.pos1)}
						{/* span: */}
						<span ref={span}>
							{state.data.slice(state.pos1, state.pos2)}
						</span>
						{`${state.data.slice(state.pos2)}\n`}
					</pre>
				</div>
				{/* textarea: */}
				<div style={stylex.parse("absolute -x -y pointer-events")}>
					{React.createElement(
						"textarea",
						{
							ref: textarea,

							style: stylex.parse("c:black -a:5%"),

							onFocus: dispatch.focus,
							onBlur:  dispatch.blur,

							onSelect: e => {
								const { selectionStart, selectionEnd } = textarea.current
								dispatch.select(selectionStart, selectionEnd)
							},

							onPointerDown: e => {
								isPointerDown.current = true
							},

							// Covers WebKit and Gecko (used to be
							// selectionchange and onSelect):
							onPointerMove: e => {
								if (!isPointerDown.current) {
									// No-op
									return
								}
								const { selectionStart, selectionEnd } = textarea.current
								dispatch.select(selectionStart, selectionEnd)
							},

							onPointerUp: e => {
								isPointerDown.current = false
							},

							onKeyDown: e => {
								switch (true) {
								case onKeyDown.isTab(e):
									e.preventDefault()
									document.execCommand("insertText", false, "\t")
									return
								default:
									// No-op
									break
								}
							},

							onChange: e => {
								// Get the action type:
								let actionType = ActionTypes.CHANGE
								switch (e.nativeEvent.inputType) {
								case "deleteByCut":
									actionType = ActionTypes.CUT
									break
								case "insertFromPaste":
									actionType = ActionTypes.PASTE
									break
								default:
									// No-op
									break
								}
								const { selectionStart, selectionEnd } = textarea.current
								dispatch.change(actionType, e.target.value, selectionStart, selectionEnd)
							},

							onCopy: dispatch.copy,

							// spellCheck: state.spellCheck,
							// spellCheck: false,
						},
					)}
				</div>
			</article>
			{/* </div> */}
			{props.debugger && (
				<Debugger state={state} />
			)}
		</Provider>
		// </CSSDebugger>
	)
}

export default TextareaEditor
