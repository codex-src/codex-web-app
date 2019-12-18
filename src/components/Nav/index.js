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
				<Text style={stylex("c:blue-a400")}>
					Sign up now
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
				<div style={stylex("flex -r -x:between w:1024 h:64")}>

					<NavList>
						<NavItem to="/">
							<div style={stylex("p-r:8")}>
								<div style={stylex("wh:18 b:blue-a400 br:max")} />
							</div>
							<CodexLogo style={stylex("w:72 h:18")} />
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
