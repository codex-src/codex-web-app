import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"

export const Nav = props => (
	<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30" {...props}>
		<div className="relative flex flex-row justify-between w-full max-w-screen-lg">
			{props.children}
		</div>
	</div>
)

export const NavLogo = props => (
	<Link className="-mx-3 flex flex-row items-center" {...props}>
		<Feather.Layers className="mx-3 w-8 h-8 text-md-blue-a400" />
	</Link>
)

export const NavLink = ({ text, ...props }) => (
	<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 tx-75" {...props}>
		<p className="font-medium">
			{text}
		</p>
	</Link>
)

export const NavLinkCTA = ({ to, text, ...props }) => (
	<div className="mx-3 flex flex-row items-center" {...props}>
		<Link className="px-4 py-3 block text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" to={to}>
			<p className="font-medium">
				{text}
			</p>
		</Link>
	</div>
)

export const DropDownLink = ({ text, ...props }) => (
	<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" {...props}>
		<p className="font-medium -text-px">
			{text}
		</p>
	</Link>
)

// const DropDownShortcut = props => (
// 	<span className="px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
// 		{props.children}
// 	</span>
// )
