import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

// <Editor.Editor
// 	state={state} dispatch={dispatch}
// 	// nav={80} mainInsetTop={80} mainInsetBottom={80} footer={80}
// 	// scrollPastEnd
// />

// <textarea
// 	style={stylex.parse("wh:max fs:19")}
// 	value={state}
// 	onChange={e => setState(e.target.value)}
// 	autoFocus
// />

// function GboardApp(props) {
// 	// const [state, setState] = React.useState("Hello, world!") // Editor.useEditor("Hello, 😀 world!")
// 	//
// 	// React.useEffect(() => {
// 	// 	console.log(state)
// 	// }, [state])
//
// 	return (
// 		<div style={stylex.parse("p:32")}>
// 			{React.createElement(
// 				"article",
// 				{
// 					contentEditable: true,
// 					suppressContentEditableWarning: true,
//
// 					// onKeyPress: e => {
// 					// 	console.log("onKeyPress")
// 					// },
//
// 					// onKeyDown: e => {
// 					// 	console.log("onKeyDown")
// 					// },
//
// 					// onInput: e => {
// 					// 	console.log("onInput")
// 					// },
//
// 					onCompositionEnd: e => {
// 						console.log("onCompositionEnd")
// 					},
//
// 				},
// 				"Hello, world!",
// 			)}
// 		</div>
// 	)
// }

function GboardApp(props) {
	const [state, dispatch] = Editor.useEditor("Hello, world!")

	return (
		<div style={stylex.parse("p:32")}>
			<Editor.Editor
				state={state}
				dispatch={dispatch}
				// scrollPastEnd
			/>
		</div>
	)
}

export default GboardApp
