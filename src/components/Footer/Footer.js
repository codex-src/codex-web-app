import * as StatusDot from "./StatusDot"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import { Cpu, GitHub, MessageSquare } from "react-feather"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:15 c:gray-200")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("fw:700 fs:15 lh:100% c:gray-200")} {...props}>
		{props.children}
	</p>
))

// const CopyrightText = stylex.Styleable(props => (
// 	<p style={stylex.parse("fs:15 lh:100% c:gray")} {...props}>
// 		{props.children}
// 	</p>
// ))

const FooterItem = stylex.Unstyleable(props => (
	<Router.Link style={stylex.parse("p-x:12 flex -r -y:center h:max")} {...props}>
		{props.children}
	</Router.Link>
))

const FooterList = stylex.Unstyleable(props => (
	<div style={stylex.parse("m-x:-12 flex -r")}>
		{props.children}
	</div>
))

const Footer = props => (
	<footer style={stylex.parse("p-x:32 flex -r -x:center b:gray-900")}>
		<div style={stylex.parse("flex -r -x:between w:1024 h:80")}>

			<FooterList>
				<FooterItem to="/systems">
					<Text>
						<StatusDot.Info />{" \u00a0"}
						Systems
					</Text>
				</FooterItem>
				<FooterItem to="/api">
					<Icon icon={Cpu} />
					<div style={stylex.parse("w:6")} />
					<Text>
						API
					</Text>
				</FooterItem>
				<FooterItem to="https://github.com/codex-src">
					<Icon icon={GitHub} />
					<div style={stylex.parse("w:6")} />
					<Text>
						Open source
					</Text>
				</FooterItem>
				<FooterItem to="/support">
					<Icon style={{ fill: "currentColor" }} icon={MessageSquare} />
					<div style={stylex.parse("w:6")} />
					<Text>
						Support
					</Text>
				</FooterItem>
			</FooterList>

			<FooterList>
				<FooterItem>
					{/* <CopyrightText> */}
					{/* 	© Codex */}
					{/* </CopyrightText> */}
					<CodexLogo style={stylex.parse("w:80 h:20 c:gray-200")} />
				</FooterItem>
			</FooterList>

		</div>
	</footer>
)

export default Footer
