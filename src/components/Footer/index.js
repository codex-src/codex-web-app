import * as StatusDot from "./StatusDot"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

const Text = ({ style, ...props }) => (
	<p style={{ ...stylex("fw:700 fs:15 lh:100% c:gray-200"), ...style }} {...props}>
		{props.children}
	</p>
)

const CopyrightText = ({ style, ...props }) => (
	<p style={{ ...stylex("fs:15 lh:100% c:gray"), ...style }} {...props}>
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

const Footer = props => (
	<footer style={stylex("flex -r -x:center b:gray-900")}>
		<div style={stylex("p-x:32 flex -r -x:between w:1024 h:80")}>

			{/* LHS */}
			<FooterList>
				<FooterItem to="/systems">
					<Text>
						<StatusDot.Info />{" "}
						&nbsp;Systems
					</Text>
				</FooterItem>
				<FooterItem to="/api">
					<Text>
						API
					</Text>
				</FooterItem>
				<FooterItem to="https://github.com/codex-src">
					<Text>
						Open source
					</Text>
				</FooterItem>
				<FooterItem to="/contribute">
					<Text>
						Contribute
					</Text>
				</FooterItem>
				<FooterItem to="/faq">
					<Text>
						FAQ
					</Text>
				</FooterItem>
				<FooterItem to="/support">
					<Text>
						Support
					</Text>
				</FooterItem>
			</FooterList>

			{/* RHS */}
			<FooterList>
				<FooterItem>
					<CopyrightText>
						© Codex
					</CopyrightText>
				</FooterItem>
			</FooterList>

		</div>
	</footer>
)

export default Footer
