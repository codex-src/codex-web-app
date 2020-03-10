import LINK from "components/Link"
import React from "react"

// {subtext && (
// 	<p className="mt-1 font-medium text-md-blue-a400" style={{ fontSize: "0.8125rem" /* 13px */ }}>
// 		{subtext}
// 	</p>
// )}

export const Link = ({ text, subtext, ...props }) => (
	<LINK className="px-4 py-2 hover:bg-gray-100 trans-75" {...props}>
		<p className="font-medium -text-px text-gray-800">
			{text}
		</p>
	</LINK>
)

export const Base = React.forwardRef((props, ref) => (
	<div ref={ref} className="-mt-2 py-2 absolute right-0 top-full w-48 bg-white rounded-lg shadow-hero-lg">
		{props.children}
	</div>
))
