import React from "react"
import Router from "components/Router"
import stylex from "stylex"

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fs:15 lh:100% c:gray-800"), ...style }} {...props}>
		{props.children}
	</p>
)

const NavList = props => (
	<div style={stylex("m-x:-8 flex -r")} {...props}>
		{props.children}
	</div>
)

const NavItem = props => (
	<Router.Link style={stylex("p-x:8 flex -r -y:center")} {...props}>
		<Text>
			{props.children}
		</Text>
	</Router.Link>
)

const NavItemCTA = props => (
	<Router.Link style={stylex("p-x:8 flex -r -y:center")} {...props}>
		<div style={{ ...stylex("p-x:8 p-y:10 br:2"), boxShadow: "0 0 0 1px hsla(var(--blue-a400), 0.5)" }}>
			<Text style={stylex("c:blue-a400")}>
				{props.children}
			</Text>
		</div>
	</Router.Link>
)

// TODO: Add authenticated `nav`.
const Nav = props => (
	<nav style={stylex("sticky -x -t")}>
		<div style={stylex("p-x:32 flex -r -x:center")}>
			<div style={{ ...stylex("flex -r -x:between w:1024 h:64"), boxShadow: "inset 0 -1px hsl(var(--gray-200))" }}>

				<NavList>
					<NavItem
						to="/"
						children="TODO"
					/>
				</NavList>

				<NavList>
					<NavItem
						to="/our-story"
						children="Our story"
					/>
					<NavItem
						to="/pricing"
						children="Pricing"
					/>
					<NavItem
						to="/sign-in"
						children="Login"
					/>
					<NavItemCTA
						to="/sign-up"
						children="Sign up now"
					/>
				</NavList>

			</div>
		</div>
	</nav>
)

export default Nav
