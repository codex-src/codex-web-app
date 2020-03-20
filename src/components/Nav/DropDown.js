import $Link from "components/Link"
import React from "react"

export const HR = props => (
	<hr className="-mx-px my-2 border-gray-300 dark:border-gray-650" />
)

export const Link = ({ text, subtext, ...props }) => (
	// eslint-disable-next-line react/jsx-pascal-case
	<$Link className="-mx-px px-4 py-1 text-black dark:text-white hover:text-white hover:bg-md-blue-a400" {...props}>
		<p className="font-medium -text-px">
			{text}
		</p>
	</$Link>
)

export const Base = React.forwardRef((props, ref) => (
	// NOTE: Use py-2 because Link uses py-1
	<div ref={ref} className="-mt-2 absolute right-0 top-full w-48 bg-white dark:bg-gray-750 rounded-lg shadow-hero-lg">
		<div className="py-2 border border-transparent dark:border-gray-700 rounded-lg dark:shadow-hero-lg">
			{props.children}
		</div>
	</div>
))
