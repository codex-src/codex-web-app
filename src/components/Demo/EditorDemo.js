// import Editor from "components/Editor"
// import raw from "raw.macro"
// import React from "react"
//
// const LOCAL_STORAGE_KEY = "codex-app"
//
// const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")
//
// function Demo(props) {
// 	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true /* statusBar: true */ })
//
// 	React.useEffect(() => {
// 		localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
// 	}, [state.data])
//
// 	return (
// 		<Editor.Editor
// 			state={state}
// 			dispatch={dispatch}
// 		/>
// 	)
// }
//
// export default Demo
