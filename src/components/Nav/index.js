import React from "react"
import Router from "components/Router"
import stylex from "stylex"

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fs:15 lh:100% c:gray-800"), ...style }} {...props}>
		{props.children}
	</p>
)

const CTAButton = props => (
	<div style={{ ...stylex("p:10 br:2"), boxShadow: "0 0 0 1px hsla(var(--blue-a400), 0.5)" }}>
		{props.children}
	</div>
)

/* eslint-disable jsx-a11y/anchor-has-content */
function NavItem(props) {
	let Wrapper = newProps => <div {...newProps} />
	if (props.to) {
		Wrapper = newProps => props.to.startsWith("/") ? <Router.Link {...newProps} />
			: <a href={props.to} {...{ ...newProps, to: undefined }} />
	}
	return (
		<Wrapper style={stylex("p-x:8 flex -r -y:center h:max")} {...props}>
			{props.children}
		</Wrapper>
	)
}

const NavList = props => (
	<div style={stylex("m-x:-8 flex -r")}>
		{props.children}
	</div>
)

// TODO: Add authenticated `nav`.
const Nav = props => (
	<nav style={stylex("sticky -x -t")}>
		<div style={stylex("p-x:32 flex -r -x:center b:white")}>
			<div style={stylex("flex -r -x:between w:1024 h:64")}>

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
					<NavItem to="/#features">
						<Text>
							Features
						</Text>
					</NavItem>
					<NavItem to="/#pricing">
						<Text>
							Pricing
						</Text>
					</NavItem>
					<NavItem to="/faq">
						<Text>
							FAQ
						</Text>
					</NavItem>
					<NavItem to="/sign-in">
						<Text>
							Login
						</Text>
					</NavItem>
					<NavItem to="/sign-up">
						<CTAButton>
							<Text style={stylex("c:blue-a400")}>
								Become a member
							</Text>
						</CTAButton>
					</NavItem>
				</NavList>

			</div>
		</div>
	</nav>
)

export default Nav
