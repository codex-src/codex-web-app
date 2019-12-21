import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fs:15 lh:100% c:gray-800")} {...props}>
		{props.children}
	</p>
))

const CTAButton = stylex.Styleable(props => (
	<div style={{ ...stylex.parse("p-x:12 p-y:10 br:2"), boxShadow: "inset 0 0 0 1px hsla(var(--blue-a400), 0.5)" }} {...props}>
		{props.children}
	</div>
))

const NavItem = stylex.Unstyleable(props => (
	<Router.Link style={stylex.parse("p-x:8 flex -r -y:center h:max")} {...props}>
		{props.children}
	</Router.Link>
))

const NavList = stylex.Unstyleable(props => (
	<div style={stylex.parse("m-x:-8 flex -r")}>
		{props.children}
	</div>
))

const UnauthNav = props => (
	<NavList>
		<NavItem to="/our-story">
			<Text>
				Our story
			</Text>
		</NavItem>
		<NavItem to="/features">
			<Text>
				Features
			</Text>
		</NavItem>
		<NavItem to="/pricing">
			<Text>
				Pricing
			</Text>
		</NavItem>
		<NavItem to="/sign-in">
			<Text>
				Login
			</Text>
		</NavItem>
		<NavItem to="/sign-up">
			<CTAButton>
				<Text style={stylex.parse("c:blue-a400")}>
					Sign up
				</Text>
			</CTAButton>
		</NavItem>
	</NavList>
)

const AuthNav = props => (
	<NavList>
		<NavItem to="/new">
			<Text>
				New note
			</Text>
		</NavItem>
		<NavItem to="/notes">
			<Text>
				My notes
			</Text>
		</NavItem>
		<NavItem to="/preferences">
			<Text>
				Preferences
			</Text>
		</NavItem>
		<NavItem to="/account">
			<Text>
				Account
			</Text>
		</NavItem>
	</NavList>
)

function Nav(props) {
	const [state] = React.useContext(User.Context)

	return (
		<nav style={stylex.parse("sticky -x -t")}>
			<div style={stylex.parse("p-x:32 flex -r -x:center b:white")}>
				<div style={stylex.parse("flex -r -x:between w:1024 h:80")}>

					<NavList>
						<NavItem to="/">
							<div style={stylex.parse("m-r:12 wh:24 b:gray-200 br:max")} />
							<CodexLogo style={stylex.parse("w:80 h:20")} />
						</NavItem>
					</NavList>

					{!state.isAuth ? (
						// Unauthenticated:
						<UnauthNav />
					) : (
						// Authenticated:
						<AuthNav />
					)}

				</div>
			</div>
		</nav>
	)
}

export default Nav
