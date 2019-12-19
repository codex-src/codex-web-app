import Feather from "components/Feather"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fs:15 lh:100% c:gray-800"), ...style }} {...props}>
		{props.children}
	</p>
)

const CTAButton = ({ style, ...props }) => (
	<div style={{ ...stylex("p:12 br:2"), boxShadow: "inset 0 0 0 1px hsla(var(--blue-a400), 0.5)", ...style }} {...props}>
		{props.children}
	</div>
)

const NavItem = props => (
	<Router.Link style={stylex("p-x:8 flex -r -y:center h:max")} {...props}>
		{props.children}
	</Router.Link>
)

const NavList = props => (
	<div style={stylex("m-x:-8 flex -r")}>
		{props.children}
	</div>
)

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
				<Text style={stylex("flex -r :center c:blue-a400")}>
					Sign up now{" \u00a0"}
					<Feather.Plus style={stylex("wh:15")} />
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

// TODO: Add authenticated `nav`.
function Nav(props) {
	const [state] = React.useContext(User.Context)

	return (
		<nav style={stylex("sticky -x -t")}>
			<div style={stylex("p-x:32 flex -r -x:center b:white")}>
				<div style={stylex("flex -r -x:between w:1024 h:80")}>

					<NavList>
						<NavItem to="/">
							<div style={stylex("m-r:12 wh:24 b:gray-200 br:max")} />
							<CodexLogo style={stylex("w:80 h:20")} />
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
