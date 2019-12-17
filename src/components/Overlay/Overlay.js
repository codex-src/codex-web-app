import React from "react"
import stylex from "stylex"

export const Icon = ({ icon: Icon, style, ...props }) => (
	<Icon style={{ ...stylex("wh:20 sw:500"), ...style }} {...props} />
)

export const ButtonItem = ({ style, ...props }) => (
	<div style={{ ...stylex("m:-20 p:20 flex -r :center pointer"), ...style }} {...props}>
		{props.children}
	</div>
)

export const ButtonList = props => (
	<div style={stylex("absolute -x -t")}>
		<div style={stylex("p:16 flex -r -x:center")}>
			<div style={stylex("relative w:1280")}>
				{props.children}
			</div>
		</div>
	</div>
)

// FIXME: Add `useEffect` for `#root`.
export const Overlay = props => (
	<aside style={stylex("absolute -x -y b:white")}>
		{props.children}
	</aside>
)
