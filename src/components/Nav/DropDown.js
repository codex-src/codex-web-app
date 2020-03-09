import $Link from "components/Link"
import React from "react"

export const Link = ({ text, subtext, ...props }) => (
	<div className="group">
		<$Link className="px-4 py-1 group-hover:text-white group-hover:bg-md-blue-400 trans-75" {...props}>
			<p className="font-medium -text-px text-gray-800 group-hover:text-white trans-75">
				{text}
			</p>
			{subtext && (
				<p className="mt-1 font-medium tracking-wide text-gray-600 group-hover:text-white trans-75" style={{ fontSize: "0.8125rem" /* 13px */ }}>
					{subtext}
				</p>
			)}
		</$Link>
	</div>
)

export const Base = React.forwardRef((props, ref) => (
	<div ref={ref} className="-mt-2 py-3 absolute right-0 top-full w-48 bg-gray-50 rounded-lg shadow-hero-lg">
		{props.children}
	</div>
))
