import * as Feather from "react-feather"
import * as StatusCircle from "./StatusCircle"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:15 middle c:gray")} />
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
	<Router.Link style={stylex.parse("p-x:8 flex -r -y:center h:max")} {...props}>
		{props.children}
	</Router.Link>
))

const FooterList = stylex.Unstyleable(props => (
	<div style={stylex.parse("m-x:-8 flex -r")}>
		{props.children}
	</div>
))

// const [shouldSetBackdrop, setShouldSetBackdrop] = React.useState(false)
//
// React.useEffect(() => {
// 	const handleScroll = () => {
// 		const percent = (window.scrollY + window.innerHeight) / document.body.scrollHeight
// 		setShouldSetBackdrop(percent >= 0.5)
// 	}
// 	// https://developers.google.com/web/tools/lighthouse/audits/passive-event-listeners
// 	document.addEventListener("scroll", handleScroll, { passive: true })
// 	return () => {
// 		setShouldSetBackdrop(false) // Revert changes.
// 		document.removeEventListener("scroll", handleScroll, { passive: true })
// 	}
// }, [])
//
// React.useEffect(() => {
// 	if (!shouldSetBackdrop) {
// 		document.body.parentNode.style.background = ""
// 		document.body.style.background = ""
// 	} else {
// 		// Reverse order:
// 		document.body.style.background = "hsl(var(--white))"
// 		document.body.parentNode.style.background = "hsl(var(--gray-900))"
// 	}
// }, [shouldSetBackdrop])

const Footer = props => (
	<footer style={stylex.parse("p-x:32 flex -r -x:center b:gray-900")}>
		<div style={stylex.parse("flex -r -x:between w:1024 h:80")}>

			{/* LHS */}
			<FooterList>
				<FooterItem to="/systems">
					<Text>
						<StatusCircle.Info />
						&nbsp;
						Systems
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
						&nbsp;
						<Icon icon={Feather.ExternalLink} />
					</Text>
				</FooterItem>
				{/* FIXME: Change URL. */}
				<FooterItem to="https://twitter.com/@username_ZAYDEK">
					<Text>
						Twitter
						&nbsp;
						<Icon icon={Feather.ExternalLink} />
					</Text>
				</FooterItem>
				<FooterItem to="/support">
					<Text>
						Support
					</Text>
				</FooterItem>
				<FooterItem to="/feedback">
					<Text>
						Feedback
					</Text>
				</FooterItem>
			</FooterList>

			{/* RHS */}
			<FooterList>
				<FooterItem>
					<CodexLogo style={stylex.parse("w:80 h:20 c:white")} />
				</FooterItem>
			</FooterList>

		</div>
	</footer>
)

export default Footer
