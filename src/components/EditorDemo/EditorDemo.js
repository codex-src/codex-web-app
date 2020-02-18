import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import Readme from "./Readme"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./EditorDemo.md")

function Demo(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, /* statusBar: true */ })

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	// FIXME: Disable shortcuts
	return (
		<div>

			{/* <div className="fixed right-0 inset-y-0 z-30 w-full max-w-md h-full pointer-events-none"> */}
			{/* 	<div */}
			{/* 		className="p-6 max-h-full bg-white shadow-hero-xl overflow-y-scroll scrolling-touch pointer-events" */}
			{/* 		// style={{ transform: "scale(0.95)" }} */}
			{/* 	> */}
			{/* 		<Readme /> */}
			{/* 	</div> */}
			{/* </div> */}

			<div className="fixed right-0 inset-y-0 inset-y-0">
				<div
					className="p-6 max-w-md h-full bg-white shadow-hero-sm overflow-y-scroll scrolling-touch"
					// style={{ transform: "scale(0.95)" }}
				>
					<Readme />
				</div>
			</div>

			<div className="px-6 py-32 flex justify-center !bg-gray-200">
				<div style={{ maxWidth: 834 }}>
					<Editor.Editor state={state} dispatch={dispatch} />
				</div>
			</div>
		</div>
	)
}

// <div className="px-4 py-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-30 pointer-events-none">
// 	<div
// 		className="px-2 py-1 flex flex-row justify-between !w-full !max-w-2xl bg-white rounded-md shadow-hero-md pointer-events-auto"
// 		// style={{ paddingTop: "0.125rem", paddingBottom: "0.125rem" }}
// 	>
// 		<div className="mr-4 flex flex-row">
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.ArrowLeft
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.ArrowRight
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 		</div>
// 		{/* <div className="my-1"> */}
// 		{/* 	<div className="w-px h-full bg-gray-200" /> */}
// 		{/* </div> */}
// 		<div className="mx-4 flex flex-row">
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Scissors
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Copy
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Clipboard
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 		</div>
// 		{/* <div className="mx-4 flex flex-row"> */}
// 		{/* 	<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer"> */}
// 		{/* 		<Feather.Italic */}
// 		{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
// 		{/* 		/> */}
// 		{/* 	</div> */}
// 		{/* 	<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer"> */}
// 		{/* 		<Feather.Bold */}
// 		{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
// 		{/* 		/> */}
// 		{/* 	</div> */}
// 		{/* 	<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer"> */}
// 		{/* 		<Feather.Code */}
// 		{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
// 		{/* 		/> */}
// 		{/* 	</div> */}
// 		{/* 	<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer"> */}
// 		{/* 		<Feather.Link */}
// 		{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
// 		{/* 		/> */}
// 		{/* 	</div> */}
// 		{/* </div> */}
// 		{/* <div className="my-1"> */}
// 		{/* 	<div className="w-px h-full bg-gray-200" /> */}
// 		{/* </div> */}
// 		<div className="mx-4 flex flex-row">
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Code
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Search
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 		</div>
// 		{/* <div className="my-1"> */}
// 		{/* 	<div className="w-px h-full bg-gray-200" /> */}
// 		{/* </div> */}
// 		<div className="ml-4 flex flex-row">
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.Info
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
// 				<Feather.HelpCircle
// 					className="stroke-500 w-4 h-4 text-gray-800"
// 				/>
// 			</div>
// 			{/* <div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer"> */}
// 			{/* 	<Feather.Tag */}
// 			{/* 		className="stroke-500 w-4 h-4 text-gray-800" */}
// 			{/* 	/> */}
// 			{/* </div> */}
// 		</div>
// 	</div>
// </div>

export default Demo
