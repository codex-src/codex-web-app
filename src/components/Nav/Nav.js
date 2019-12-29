import * as Feather from "react-feather"
import React from "react"
import RouterLink from "components/RouterLink"
import stylex from "stylex"
import User from "components/User"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

import "./nav.css"

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:15 middle c:blue-a400")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fs:15 lh:100% c:gray-800")} {...props}>
		{props.children}
	</p>
))

// NOTE: `CTAButton` doesn’t use `flex -r -y:center`.
const CTAButton = stylex.Styleable(props => (
	<div style={{ ...stylex.parse("p:12 br:2"), boxShadow: "inset 0px 0px 0px 1px hsla(var(--blue-a400), 0.5)" }} {...props}>
		{props.children}
	</div>
))

const NavItem = stylex.Unstyleable(props => (
	<RouterLink style={stylex.parse("p-x:8 flex -r -y:center h:max")} {...props}>
		{props.children}
	</RouterLink>
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
				{/* <Icon icon={Feather.MapPin} /> */}
				{/* &nbsp; */}
				Our story
			</Text>
		</NavItem>
		<NavItem to="/features">
			<Text>
				{/* <Icon icon={Feather.Package} /> */}
				{/* &nbsp; */}
				Features
			</Text>
		</NavItem>
		<NavItem to="/pricing">
			<Text>
				{/* <Icon icon={Feather.Tag} /> */}
				{/* &nbsp; */}
				Pricing
			</Text>
		</NavItem>
		<NavItem to="/sign-in">
			<Text>
				{/* <Icon icon={Feather.LogIn} /> */}
				{/* &nbsp; */}
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
				<Icon icon={Feather.Edit} />
				<span className="hide-mobile">
					&nbsp;
					New note
				</span>
			</Text>
		</NavItem>
		<NavItem to="/notes">
			<Text>
				<Icon icon={Feather.Layers} />
				<span className="hide-mobile">
					&nbsp;
					My notes
				</span>
			</Text>
		</NavItem>
		<NavItem to="/preferences">
			<Text>
				<Icon icon={Feather.Settings} />
				<span className="hide-mobile">
					&nbsp;
					Preferences
				</span>
			</Text>
		</NavItem>
		<NavItem to="/account">
			<Text>
				<Icon icon={Feather.Lock} />
				<span className="hide-mobile">
					&nbsp;
					Account
				</span>
			</Text>
		</NavItem>
	</NavList>
)

function Nav(props) {
	const [state] = React.useContext(User.Context)

	return (
		<nav style={stylex.parse("sticky -x -t z:1 b:white -a:95%")}>
			<div style={stylex.parse("p-x:24 flex -r -x:center")}>
				<div style={stylex.parse("flex -r -x:between w:1024 h:80")}>

					{/* LHS */}
					<NavList>
						<NavItem to="/">
							{/* <div style={stylex.parse("wh:24 b:gray-200 br:max")} /> */}
							{/* <div style={stylex.parse("w:12")} /> */}
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
