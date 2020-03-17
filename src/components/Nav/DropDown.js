import $Link from "components/Link"
import React from "react"

export const HR = props => (
	<hr className="my-2 border-gray-300 dark:border-gray-700" />
)

export const Link = ({ text, subtext, ...props }) => (
	// eslint-disable-next-line react/jsx-pascal-case
	<$Link className="px-4 py-1 text-gray-800 dark:text-gray-200 hover:text-white hover:bg-md-blue-a400" {...props}>
		<p className="font-medium -text-px">
			{text}
		</p>
	</$Link>
)

export const Base = React.forwardRef((props, ref) => (
	<div ref={ref} className="-mt-2 absolute right-0 top-full w-48 bg-white dark:bg-gray-750 rounded-lg shadow-hero-lg">
		{/* NOTE (1): Use py-2 because Link uses py-1 */}
		{/* NOTE (2): py-* needs to be inside */}
		<div className="py-2 rounded-lg" style={{ boxShadow: "0 0 0 1px var(--gray-700), var(--shadow-md)" }}>
			{props.children}
		</div>
	</div>
))
