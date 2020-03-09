import Link from "components/Link"
import React from "react"

export const DropDownText = props => (
	<p className="font-medium -text-px" {...props} />
)

export const DropDownLink = props => (
	<Link className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" {...props} />
)

// export const DropDownButtonWarn = props => (
// 	<button className="px-4 py-2 text-gray-800 w-full hover:text-red-600 hover:bg-red-100" onPointerDown={e => e.preventDefault()} {...props} />
// )

export const DropDownItem = props => (
	<DropDownLink {...props}>
		<DropDownText>
			{props.children}
		</DropDownText>
	</DropDownLink>
)

// export const DropDownItemWarn = props => (
// 	<DropDownButtonWarn {...props}>
// 		<DropDownText>
// 			{props.children}
// 		</DropDownText>
// 	</DropDownButtonWarn>
// )

export const DropDown = React.forwardRef((props, ref) => (
	<div ref={ref} className="py-2 absolute right-0 top-full w-48 bg-white rounded-lg shadow-hero-md" {...props} />
))

export const DropDownMenuButtonMd = props => (
	<button className="-mx-3 px-6 relative flex flex-row items-center md:hidden" onPointerDown={e => e.preventDefault()} {...props} />
)
