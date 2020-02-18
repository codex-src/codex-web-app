import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import ReadmeEditor from "./ReadmeEditor"
import UIBar from "./UIBar"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")

function DemoEditor(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, /* statusBar: true */ })

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	// FIXME: Shortcuts
	return <Editor.Editor state={state} dispatch={dispatch} />
}

// const CloseButton = props => (
// 	<div className="p-12 fixed right-0 top-0 pointer-events-none">
// 		<div className="flex flex-row justify-center items-center w-10 h-10 text-gray-800 bg-white hover:bg-gray-100 rounded-full !shadow-xs cursor-pointer transition duration-200 ease-in-out pointer-events-auto">
// 			<Feather.ArrowRight className="stroke-500 w-5 h-5" />
// 		</div>
// 	</div>
// )

const Demo = props => (
	<React.Fragment>
		{/* <div */}
		{/* 	className="p-6 fixed inset-0 z-40 flex flex-row justify-center items-center pointer-events-none" */}
		{/* 	style={{ transform: "scale(0.95)" }} */}
		{/* > */}
		{/* 	<div className="p-6 max-w-2xl max-h-full bg-white rounded-md shadow-md overflow-y-scroll scrolling-touch pointer-events-auto"> */}
		{/* 		<ReadmeEditor /> */}
		{/* 	</div> */}
		{/* </div> */}
		{/* <div className="fixed inset-0 z-30" style={{ background: "hsla(0, 0%, 0%, 0.1)" }} /> */}
		<div className="md:py-24 flex justify-center !bg-md-gray-50">
			<div className="p-6 max-w-3xl bg-white">
				<DemoEditor />
			</div>
		</div>
		<UIBar />
	</React.Fragment>
)

export default Demo
