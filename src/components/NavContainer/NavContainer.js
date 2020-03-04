import Nav from "components/Nav"
import React from "react"

const NavContainer = props => (
	<React.Fragment>
		<Nav />
		<div className="py-32 flex flex-row justify-center min-h-full">
			<div className="px-6 flex flex-col lg:flex-row lg:items-center w-full max-w-screen-lg">
				{props.children}
			</div>
		</div>
	</React.Fragment>
)

export default NavContainer
