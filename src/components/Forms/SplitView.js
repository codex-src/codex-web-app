import React from "react"

export const SplitViewLHS = ({ children }) => (
	<div className="flex flex-row justify-center min-h-screen">
		<div className="lg:ml-12 flex-none flex flex-row justify-center items-center w-full max-w-xl">
			<div className="px-6 py-24 flex-none w-full max-w-md">
				{children[0]}
			</div>
		</div>
		<div className="flex-1 hidden lg:block bg-gray-100">
			{children[1]}
		</div>
	</div>
)

export const SplitViewRHS = ({ children }) => (
	<div className="flex flex-row justify-center min-h-screen">
		<div className="flex-1 hidden lg:block bg-gray-100">
			{children[0]}
		</div>
		<div className="lg:mr-12 flex-none flex flex-row justify-center items-center w-full max-w-xl">
			<div className="px-6 py-24 flex-none w-full max-w-md">
				{children[1]}
			</div>
		</div>
	</div>
)
