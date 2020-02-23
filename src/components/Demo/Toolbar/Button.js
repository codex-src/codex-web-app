import React from "react"

const ButtonUI = ({ svg: SVG, extend, ...props }) => (
	<button
		className={`p-2 rounded-lg focus:outline-none cursor-pointer ${extend}`}
		{...props}
	>
		<SVG className="p-px w-5 h-5 stroke-500" />
	</button>
)

const Button = ({ active, ...props }) => {
	let Component = null
	if (props.disabled) { // Do not destructure disabled
		Component = <ButtonUI extend="text-md-gray hover:bg-md-gray-100" {...props} />
	} else if (!active) {
		Component = <ButtonUI extend="text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200" {...props} />
	} else {
		Component = <ButtonUI extend="text-blue hover:bg-blue-100" {...props} />
	}
	return Component
}

export default Button
