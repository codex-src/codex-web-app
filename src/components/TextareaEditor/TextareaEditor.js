// import StatusBar from "./StatusBar"
import ActionTypes from "./ActionTypes"
import Debugger from "./Debugger"
import onKeyDown from "./onKeyDown"
import React from "react"
import ReactDOM from "react-dom"
import stylex from "stylex"
import useTextareaEditor from "./TextareaEditorReducer"

import "./TextareaEditor.css"

// // https://overreacted.io/how-does-the-development-mode-work
// const __DEV__ = process.env.NODE_ENV !== "production"

export const Context = React.createContext()

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
export function TextareaEditor(props) {
	const reactDOM = React.useRef()
	const pre = React.useRef()
	const span = React.useRef()
	const textarea = React.useRef()

	const isPointerDown = React.useRef()

	// const [state, dispatch] = useTextareaEditor(props.initialValue)
	const [state, dispatch] = useTextareaEditor(`# Hello, world!

\`\`\`jsx
const AppContainer = props => (
	<DebugCSS>
		<div style={stylex.parse("flex -c -y:between h:max")}>
			<div style={stylex.parse("b:white")}>
				<Nav />
				<main style={stylex.parse("p-x:24 p-y:80 flex -r -x:center")}>
					<div style={stylex.parse("w:1024 no-min-w")}>
						{props.children}
					</div>
				</main>
			</div>
			<Footer />
		</div>
	</DebugCSS>
)
\`\`\`

## Hello, world!

\`\`\`js
{
  "compilerOptions": { "baseUrl": "src" },
  "include": ["src"]
}
\`\`\`

### Hello, world!`)

	// https://github.com/facebook/react/issues/8514
	React.useLayoutEffect(
		React.useCallback(() => {
			textarea.current.value = state.data
		}, [state]),
		[],
	)

	// Set textarea height (dynamic -- from pre):
	React.useLayoutEffect(() => {
		const { height } = pre.current.getBoundingClientRect()
		textarea.current.style.height = `${height}px`
	}, [state.data])

	// Gets cursor position coordinates.
	const getCoords = () => {
		const rects = span.current.getClientRects()
		const start = rects[0]
		const end = rects[rects.length - 1]
		const pos1 = { x: start.left, y: start.top }
		const pos2 = { x: end.right, y: end.bottom }
		return [pos1, pos2]
	}

	// Update coords **after** updating pos1 and pos2:
	React.useEffect( // TODO: useLayoutEffect?
		React.useCallback(() => {
			if (state.pos1 !== state.pos2) {
				// No-op
				return
			}
			let [pos1, pos2] = getCoords()
			if (pos1.y < 0) {
				window.scrollBy(0, pos1.y)
				;[pos1, pos2] = getCoords()
			} else if (pos2.y >= window.innerHeight) {
				window.scrollBy(0, pos2.y - window.innerHeight)
				;[pos1, pos2] = getCoords()
			}
			dispatch.select(state.pos1, state.pos2, { pos1, pos2 })
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

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			<Debugger off>
				<article style={stylex.parse("relative")}>
					{/* reactDOM: */}
					<pre ref={reactDOM} style={stylex.parse("no-pointer-events")} />
					{/* pre: */}
					<div style={{ ...stylex.parse("absolute -x -y no-pointer-events"), visibility: "hidden" }}>
						<pre ref={pre} style={stylex.parse("c:blue -a:10%")}>
							{state.data.slice(0, state.pos1)}
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

								// style: { color: "transparent" },
								style: stylex.parse("c:red -a:10%"),

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
									// TODO: Add detab.
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
									case "cut":
									case "deleteByCut":
										actionType = ActionTypes.CUT
										break
									case "paste":
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
								spellCheck: false,
							},
						)}
					</div>
				</article>
			</Debugger>
		</Provider>
	)
}

// <StatusBar />
