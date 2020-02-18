import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import Readme from "./Readme"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./EditorDemo.md")

function Demo(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, statusBar: true })

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	// FIXME: Disable shortcuts
	return (
		<div>

			{/* <div className="p-6 fixed right-0 inset-y-0 z-30 w-full max-w-lg pointer-events-none"> */}
			{/* 	<div */}
			{/* 		className="p-6 max-h-full bg-white rounded-xl shadow-hero-xl overflow-y-scroll scrolling-touch pointer-events" */}
			{/* 		style={{ transform: "scale(0.95)" }} */}
			{/* 	> */}
			{/* 		<Readme /> */}
			{/* 	</div> */}
			{/* </div> */}

			<div className="px-4 fixed right-0 inset-y-0 flex flex-col justify-center">
				<div className="p-2 flex flex-col justify-between bg-white rounded-lg shadow-hero-sm">
					<div className="mb-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
						<Feather.ArrowLeft
							className="stroke-600 w-4 h-4 text-gray-800"
						/>
					</div>
					<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
						<Feather.ArrowRight
							className="stroke-600 w-4 h-4 text-gray-800"
						/>
					</div>
					<div className="h-8" />
					{/* <div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
					{/* 	<Feather.Bold */}
					{/* 		className="stroke-600 w-4 h-4 text-gray-800" */}
					{/* 	/> */}
					{/* </div> */}
					{/* <div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
					{/* 	<Feather.Italic */}
					{/* 		className="stroke-600 w-4 h-4 text-gray-800" */}
					{/* 	/> */}
					{/* </div> */}
					{/* <div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
					{/* 	<Feather.Code */}
					{/* 		className="stroke-600 w-4 h-4 text-gray-800" */}
					{/* 	/> */}
					{/* </div> */}
					{/* <div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
					{/* 	<Feather.Link */}
					{/* 		className="stroke-600 w-4 h-4 text-gray-800" */}
					{/* 	/> */}
					{/* </div> */}
					{/* <div className="h-8" /> */}
					<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
						<Feather.Code
							className="stroke-600 w-4 h-4 text-gray-800"
						/>
					</div>
					<div className="mt-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
						<Feather.Search
							className="stroke-600 w-4 h-4 text-gray-800"
						/>
					</div>
				</div>
			</div>

			{/* <div className="px-4 fixed inset-x-0 bottom-0 flex flex-row justify-center"> */}
			{/* 	<div className="-mx-1 px-2 flex flex-row justify-between w-full bg-white rounded-lg rounded-b-none shadow-hero-sm" style={{ maxWidth: 900 }}> */}
			{/* 		<div className="py-2 flex flex-row"> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.ArrowLeft */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.ArrowRight */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 		</div> */}
			{/* 		<div className="py-2 flex flex-row"> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Bold */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Italic */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Code */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Link */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 		</div> */}
			{/* 		<div className="py-2 flex flex-row"> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Code */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 				<Feather.Search */}
			{/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
			{/* 				/> */}
			{/* 			</div> */}
			{/* 		</div> */}
			{/* 	</div> */}
			{/* </div> */}

			{/*
				<div
					className="fixed right-0 inset-y-0 flex flex-col justify-center"
					style={{ transform: "scale(0.85) translateX(24px)" }}
				>

					<div className="py-4 w-64 bg-white rounded-xl rounded-r-none shadow-hero-md">
						<p className="px-6 py-2 hover:bg-md-gray-50 text-md-gray-800 hover:text-md-blue-a400 cursor-pointer">
							<Feather.Info
								className="mr-3 inline-block w-5 h-5"
							/>
							What is Codex?
						</p>
						<p className="px-6 py-2 hover:bg-md-gray-50 text-md-gray-800 hover:text-md-blue-a400 cursor-pointer">
							<Feather.FileText
								className="mr-3 inline-block w-5 h-5"
							/>
							Markdown Guide
						</p>
						<p className="px-6 py-2 hover:bg-md-gray-50 text-md-gray-800 hover:text-md-blue-a400 cursor-pointer">
							<Feather.Tag
								className="mr-3 inline-block w-5 h-5"
							/>
							Changelog
						</p>

						<div className="py-4">
							<div className="shadow-xs" />
						</div>

						<p className="px-6 py-2 hover:bg-md-gray-50 text-md-gray-800 hover:text-md-blue-a400 cursor-pointer">
							<Feather.Info
								className="mr-3 inline-block w-5 h-5"
							/>
							Send Feedback <span className="emoji">❤️</span>
						</p>
						<p className="px-6 py-2 hover:bg-md-gray-50 text-md-gray-800 hover:text-md-blue-a400 cursor-pointer">
							<Feather.GitHub
								className="mr-3 inline-block w-5 h-5"
							/>
							File a Bug Report
						</p>
					</div>

				</div>
			*/}

			<div className="px-6 py-32 flex justify-center bg-gray-50">
				<div style={{ maxWidth: 834 }}>
					<Editor.Editor state={state} dispatch={dispatch} />
				</div>
			</div>
		</div>
	)
}

export default Demo
