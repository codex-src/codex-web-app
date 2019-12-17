import React from "react"
import ReactDOM from "react-dom"
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

// export const Overlay = props => (
// 	<aside style={stylex("absolute -x -y b:white z:max")}>
// 		{props.children}
// 	</aside>
// )

export function Overlay(props) {
	React.useEffect(() => {
		const root = document.getElementById("root")
		root.style.display = "none"
		return () => {
			root.style.display = ""
		}
	}, [])

	const root2 = document.getElementById("root2")
	return ReactDOM.createPortal(props.children, root2)
}
