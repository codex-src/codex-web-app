import Link from "components/Link"
import React from "react"

export const NavText = props => (
	<p className="font-medium" {...props} />
)

export const NavLink = props => (
	<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 trans-75" {...props} />
)

export const NavItem = props => (
	<NavLink {...props}>
		<NavText>
			{props.children}
		</NavText>
	</NavLink>
)

export const NavItemCTA = props => (
	<div className="mx-3 flex flex-row items-center">
		<Link className="px-4 py-3 bg-white text-md-blue-a400 hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero trans-150" to={props.to}>
			<p className="font-medium">
				{props.children}
			</p>
		</Link>
	</div>
)
