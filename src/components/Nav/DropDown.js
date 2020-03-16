import $Link from "components/Link"
import React from "react"

export const Link = ({ text, subtext, ...props }) => (
	// eslint-disable-next-line react/jsx-pascal-case
	<$Link className="px-4 py-1 text-gray-800 hover:text-white hover:bg-blue-500" {...props}>
		<p className="font-medium -text-px">
			{text}
		</p>
	</$Link>
)

export const Base = React.forwardRef((props, ref) => (
	// NOTE: Use py-2 because Link uses py-1
	<div ref={ref} className="-mt-2 py-2 absolute right-0 top-full w-48 bg-white rounded-lg shadow-hero-lg">
		{props.children}
	</div>
))
