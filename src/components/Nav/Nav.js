import * as Feather from "react-feather"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:15 c:blue-a400")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fs:15 lh:100% c:gray-800")} {...props}>
		{props.children}
	</p>
))

// NOTE: `CTAButton` doesn’t use `flex -r -y:center`.
const CTAButton = stylex.Styleable(props => (
	<div style={{ ...stylex.parse("p:12 br:2"), boxShadow: "inset 0 0 0 1px hsla(var(--blue-a400), 0.5)" }} {...props}>
		{props.children}
	</div>
))

const NavItem = stylex.Unstyleable(props => (
	<Router.Link style={stylex.parse("p-x:12 flex -r -y:center h:max")} {...props}>
		{props.children}
	</Router.Link>
))

const NavList = stylex.Unstyleable(props => (
	<div style={stylex.parse("m-x:-12 flex -r")}>
		{props.children}
	</div>
))

const UnauthNav = props => (
	<NavList>
		<NavItem to="/our-story">
			<Icon icon={Feather.MapPin} />
			<div style={stylex.parse("w:6")} />
			<Text>
				Our story
			</Text>
		</NavItem>
		<NavItem to="/features">
			<Icon icon={Feather.Package} />
			<div style={stylex.parse("w:6")} />
			<Text>
				Features
			</Text>
		</NavItem>
		<NavItem to="/pricing">
			<Icon icon={Feather.Tag} />
			<div style={stylex.parse("w:6")} />
			<Text>
				Pricing
			</Text>
		</NavItem>
		<NavItem to="/sign-in">
			<Icon icon={Feather.LogIn} />
			<div style={stylex.parse("w:6")} />
			<Text>
				Login
			</Text>
		</NavItem>
		<NavItem to="/sign-up">
			<CTAButton>
				<Text style={stylex.parse("c:blue-a400")}>
					Sign up now
				</Text>
			</CTAButton>
		</NavItem>
	</NavList>
)

const AuthNav = props => (
	<NavList>
		<NavItem to="/new">
			<Icon icon={Feather.Plus} />
			<div style={stylex.parse("w:6")} />
			<Text>
				New note
			</Text>
		</NavItem>
		<NavItem to="/notes">
			<Icon icon={Feather.Book} />
			<div style={stylex.parse("w:6")} />
			<Text>
				My notes
			</Text>
		</NavItem>
		<NavItem to="/preferences">
			<Icon icon={Feather.Sliders} />
			<div style={stylex.parse("w:6")} />
			<Text>
				Preferences
			</Text>
		</NavItem>
		<NavItem to="/account">
			<Icon icon={Feather.Lock} />
			<div style={stylex.parse("w:6")} />
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

					{/* LHS */}
					<NavList>
						<NavItem to="/">
							<div style={stylex.parse("wh:24 b:gray-200 br:max")} />
							<div style={stylex.parse("w:12")} />
							<CodexLogo style={stylex.parse("w:80 h:20")} />
						</NavItem>
					</NavList>

					{/* RHS */}
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
