import React from "react"

// TODO: fill-current
const Core = ({ svg: SVG, ...props }) => (
	<button
		className={`p-2 disabled:text-gray rounded-lg focus:outline-none cursor-pointer ${props.extend}`}
		disabled={props.disabled}
		onClick={props.onClick}
	>
		<SVG className="p-px w-5 h-5 stroke-500" />
	</button>
)

const Button = ({ active, ...props }) => {
	let Component = null
	if (!active) {
		Component = <Core extend="text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200" {...props} />
	} else {
		Component = <Core extend="text-blue hover:bg-blue-100" {...props} />
	}
	return Component
}

export default Button
