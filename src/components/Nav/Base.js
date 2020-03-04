import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"

/*
 * Nav
 */

export const Nav = props => (
	<div className="fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30">
		<div className="px-6 w-full max-w-screen-lg">
			{/* NOTE: h-full is needed */}
			<div className="relative flex flex-row justify-between h-full">
				{props.children}
			</div>
		</div>
	</div>
)

export const NavLogo = props => (
	<Link className="-mx-3 flex flex-row items-center" {...props}>
		<Feather.Layers className="mx-3 w-8 h-8 text-md-blue-a400" />
	</Link>
)

export const NavLink = props => (
	<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 trans-75" {...props}>
		<p className="font-medium">
			{props.children}
		</p>
	</Link>
)

export const NavLinkCTA = ({ to, ...props }) => (
	<div className="mx-3 flex flex-row items-center" {...props}>
		<Link className="px-4 py-3 text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero trans-150" to={to}>
			<p className="font-medium">
				{props.children}
			</p>
		</Link>
	</div>
)

/*
 * DropDown
 */

export const DropDown = React.forwardRef((props, ref) => (
	<div ref={ref} className="-mt-3 py-2 absolute right-0 top-full w-56 bg-white rounded-lg shadow-hero-lg">
		{props.children}
	</div>
))

export const DropDownText = props => (
	<p className="font-medium -text-px">
		{props.children}
	</p>
)

export const DropDownLink = props => (
	<Link className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" {...props}>
		<DropDownText>
			{props.children}
		</DropDownText>
	</Link>
)

export const DropDownLinkWarn = props => (
	<Link className="px-4 py-2 text-gray-800 hover:text-red-600 hover:bg-red-100" {...props}>
		<DropDownText>
			{props.children}
		</DropDownText>
	</Link>
)
