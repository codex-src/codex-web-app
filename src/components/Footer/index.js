import React from "react"
import Router from "components/Router"
import StatusDot from "./StatusDot"
import stylex from "stylex"

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("pre fw:700 fs:11.25 lh:100% c:blue-a400"), ...style }} {...props}>
		{props.children}
	</p>
)

const CopyrightText = ({ style, ...props }) => (
	<p style={{ ...stylex("pre fs:15 lh:100% c:gray"), ...style }} {...props}>
		{props.children}
	</p>
)

/* eslint-disable jsx-a11y/anchor-has-content */
function FooterItem(props) {
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

const FooterList = props => (
	<div style={stylex("m-x:-8 flex -r")}>
		{props.children}
	</div>
)

// TODO: Add social media icons.
const Footer = props => (
	<footer style={{ ...stylex("flex -r -x:center"), boxShadow: "inset 0 1px hsl(var(--gray-200))" }} {...props}>
		<div style={stylex("p-x:32 flex -r -x:between w:1024 h:80")}>

			{/* LHS */}
			<FooterList>
				{/* Idea: Add a pulse animation to the status dot. */}
				<FooterItem to="/status">
					<Text>
						<StatusDot />{" "}
						&nbsp;STATUS
					</Text>
				</FooterItem>
				<FooterItem to="/api">
					<Text>
						API
					</Text>
				</FooterItem>
				<FooterItem to="https://github.com/codex-src">
					<Text>
						OPEN SOURCE
					</Text>
				</FooterItem>
				<FooterItem to="/contribute">
					<Text>
						CONTRIBUTE
					</Text>
				</FooterItem>
				<FooterItem to="/faq">
					<Text>
						FAQ
					</Text>
				</FooterItem>
				<FooterItem to="/support">
					<Text>
						SUPPORT
					</Text>
				</FooterItem>
				<FooterItem to="/feedback">
					<Text>
						FEEDBACK
					</Text>
				</FooterItem>
			</FooterList>

			{/* RHS */}
			<FooterList>
				<FooterItem>
					<CopyrightText>
						© 2020 Codex, Inc.
					</CopyrightText>
				</FooterItem>
			</FooterList>

		</div>
	</footer>
)

export default Footer
