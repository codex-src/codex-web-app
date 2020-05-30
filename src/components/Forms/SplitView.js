import React from "react"
import trimSpaces from "lib/trimSpaces"

const ImageClasses = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`w-full min-h-full max-h-screen object-cover
			${children.props.className}
				${className}`),
	})
)

export const SplitViewLHSBlock = ({ children }) => (
	<div className="flex flex-row justify-center min-h-screen">
		<div className="lg:ml-12 flex-none flex flex-row justify-center items-center w-full max-w-xl">
			<div className="px-6 py-24 flex-none w-full max-w-md">
				{children[0]}
			</div>
		</div>
		<div className="flex-1 hidden lg:block bg-gray-100">
			<ImageClasses>
				{children[1]}
			</ImageClasses>
		</div>
	</div>
)

export const SplitViewRHSBlock = ({ children }) => (
	<div className="flex flex-row justify-center min-h-screen">
		<div className="flex-1 hidden lg:block bg-gray-100">
			<ImageClasses>
				{children[0]}
			</ImageClasses>
		</div>
		<div className="lg:mr-12 flex-none flex flex-row justify-center items-center w-full max-w-xl">
			<div className="px-6 py-24 flex-none w-full max-w-md">
				{children[1]}
			</div>
		</div>
	</div>
)
