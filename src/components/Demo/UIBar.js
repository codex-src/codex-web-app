import * as Feather from "react-feather"
import React from "react"

const UIBar = props => (
	<div className="px-6 py-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-30 pointer-events-none">
		<div className="px-2 py-1 flex flex-row justify-between !w-full !max-w-2xl bg-white rounded-md shadow-hero-md pointer-events-auto">
			<div className="mr-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.ArrowLeft
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.ArrowRight
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
			</div>
			{/* <div className="my-1"> */}
			{/* 	<div className="w-px h-full bg-gray-300" /> */}
			{/* </div> */}
			<div className="mx-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Scissors
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Copy
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Clipboard
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
			</div>
			{/* <div className="mx-4 flex flex-row"> */}
			{/* 	<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer"> */}
			{/* 		<Feather.Italic */}
			{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
			{/* 		/> */}
			{/* 	</div> */}
			{/* 	<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer"> */}
			{/* 		<Feather.Bold */}
			{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
			{/* 		/> */}
			{/* 	</div> */}
			{/* 	<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer"> */}
			{/* 		<Feather.Code */}
			{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
			{/* 		/> */}
			{/* 	</div> */}
			{/* 	<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer"> */}
			{/* 		<Feather.Link */}
			{/* 			className="stroke-500 w-4 h-4 text-gray-800" */}
			{/* 		/> */}
			{/* 	</div> */}
			{/* </div> */}
			{/* <div className="my-1"> */}
			{/* 	<div className="w-px h-full bg-gray-300" /> */}
			{/* </div> */}
			<div className="mx-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Code
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Search
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
			</div>
			{/* <div className="my-1"> */}
			{/* 	<div className="w-px h-full bg-gray-300" /> */}
			{/* </div> */}
			<div className="ml-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.Info
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer">
					<Feather.HelpCircle
						className="stroke-500 w-4 h-4 text-gray-800"
					/>
				</div>
				{/* <div className="flex flex-row justify-center items-center w-8 h-8 hover:bg-gray-100 rounded-full cursor-pointer"> */}
				{/* 	<Feather.Tag */}
				{/* 		className="stroke-500 w-4 h-4 text-gray-800" */}
				{/* 	/> */}
				{/* </div> */}
			</div>
		</div>
	</div>
)

export default UIBar
