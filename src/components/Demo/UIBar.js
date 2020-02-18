import * as Feather from "react-feather"
import React from "react"

// {/* <div className="my-1"> */}
// {/* 	<div className="w-px h-full bg-gray-300" /> */}
// {/* </div> */}

const UIBar = props => (
	<div className="px-6 py-4 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="px-2 py-1 flex flex-row justify-between !w-full !max-w-2xl bg-gray-100 rounded-md shadow-hero-md pointer-events-auto">
			<div className="mr-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.ArrowLeft
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.ArrowRight
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
			</div>
			<div className="mx-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Scissors
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Copy
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Clipboard
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
			</div>
			<div className="mx-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Code
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Search
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
			</div>
			<div className="ml-4 flex flex-row">
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.Info
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
				<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
					<Feather.HelpCircle
						className="stroke-500 w-5 h-5 text-gray-800"
					/>
				</div>
			</div>
		</div>
	</div>
)

export default UIBar
