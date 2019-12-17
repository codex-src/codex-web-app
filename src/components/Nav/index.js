import React from "react"
import Router from "components/Router"
import stylex from "stylex"

// Extends.
const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fs:15 lh:100% c:gray-800"), ...style }} {...props}>
		{props.children}
	</p>
)

function NavItem(props) {
	let Wrapper = newProps => <div {...newProps} />
	if (props.to) {
		Wrapper = newProps => <Router.Link {...newProps} />
	}
	return (
		<Wrapper style={stylex("p-x:8 flex -r -y:center h:max")}>
			{props.children}
		</Wrapper>
	)
}

const NavItemCTA = props => (
	<NavItem>
		<div style={{ ...stylex("p-x:8 p-y:10 br:2"), boxShadow: "0 0 0 1px hsla(var(--blue-a400), 0.5)" }}>
			{props.children}
		</div>
	</NavItem>
)

const NavList = props => (
	<div style={stylex("m-x:-8 flex -r")} {...props}>
		{props.children}
	</div>
)

// TODO: Add authenticated `nav`.
const Nav = props => (
	<nav style={stylex("sticky -x -t")}>
		<div style={stylex("p-x:32 flex -r -x:center")}>
			<div style={{ ...stylex("flex -r -x:between w:1024 h:64"), boxShadow: "inset 0 -1px hsl(var(--gray-200))" }}>

				{/* LHS */}
				<NavList>
					<NavItem to="/">
						<Text>
							TODO
						</Text>
					</NavItem>
				</NavList>

				{/* RHS */}
				<NavList>
					<NavItem to="/our-story">
						<Text>
							Our story
						</Text>
					</NavItem>
					<NavItem to="/pricing">
						<Text>
							Pricing
						</Text>
					</NavItem>
					<NavItem to="/login">
						<Text>
							Our story
						</Text>
					</NavItem>
					<NavItemCTA to="/Sign up now">
						<Text style={stylex("c:blue-a400")}>
							Sign up now
						</Text>
					</NavItemCTA>
				</NavList>

			</div>
		</div>
	</nav>
)

export default Nav
