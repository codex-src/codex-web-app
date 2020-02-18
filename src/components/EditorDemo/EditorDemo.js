import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import Readme from "./Readme"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./EditorDemo.md")

// {/* <div className="px-4 fixed inset-x-0 bottom-0 flex flex-row justify-center"> */}
// {/* 	<div className="-mx-1 px-2 flex flex-row justify-between w-full bg-white rounded-lg rounded-b-none shadow-hero-sm" style={{ maxWidth: 900 }}> */}
// {/* 		<div className="py-2 flex flex-row"> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.ArrowLeft */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.ArrowRight */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 		</div> */}
// {/* 		<div className="py-2 flex flex-row"> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Bold */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Italic */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Code */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Link */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 		</div> */}
// {/* 		<div className="py-2 flex flex-row"> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Code */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 			<div className="mx-1 flex flex-row justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
// {/* 				<Feather.Search */}
// {/* 					className="inline-block stroke-600 w-4 h-4 text-gray-800" */}
// {/* 				/> */}
// {/* 			</div> */}
// {/* 		</div> */}
// {/* 	</div> */}
// {/* </div> */}

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

			{/* <div className="px-4 fixed right-0 inset-y-0 flex flex-col justify-center"> */}
			{/* 	<div className="p-2 flex flex-col justify-between bg-white rounded-lg shadow-hero-sm"> */}
			{/* 		<div className="mb-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.ArrowLeft */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.ArrowRight */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className="h-8" /> */}
			{/* 		<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.Code */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.Search */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className="h-8" /> */}
			{/* 		<div className="my-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.Info */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 		<div className="mt-1 flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"> */}
			{/* 			<Feather.HelpCircle */}
			{/* 				className="stroke-600 w-4 h-4 text-gray-800" */}
			{/* 			/> */}
			{/* 		</div> */}
			{/* 	</div> */}
			{/* </div> */}

			<div className="px-4 py-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-30">
				<div
					className="px-2 py-1 flex flex-row justify-between w-full max-w-2xl bg-white rounded-lg shadow-hero-md"
					// style={{ paddingTop: "0.125rem", paddingBottom: "0.125rem" }}
				>
					<div className="flex flex-row">
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.ArrowLeft
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.ArrowRight
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Scissors
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Copy
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Clipboard
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Italic
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Bold
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Code
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Link
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Code
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Search
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.Info
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.HelpCircle
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
						<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-100 rounded-full cursor-pointer">
							<Feather.GitHub
								className="stroke-600 w-4 h-4 text-gray-800"
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="px-6 py-32 flex justify-center bg-gray-50">
				<div style={{ maxWidth: 834 }}>
					<Editor.Editor state={state} dispatch={dispatch} />
				</div>
			</div>
		</div>
	)
}

export default Demo
