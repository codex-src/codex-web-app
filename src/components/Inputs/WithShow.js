import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

const ShowButton = ({ show, setShow, style, ...props }) => (
	<Base.Button style={{ ...stylex("flex -r :center w:74.469 br:6"), ...style }} onClick={e => setShow(!show)}>
		<p style={stylex("fw:500 fs:12 ls:10% lh:100% c:gray")}>
			{!show ? (
				"SHOW"
			) : (
				"HIDE"
			)}
		</p>
	</Base.Button>
)

const WithShow = ({ show, setShow, ...props }) => (
	<div style={{ ...stylex("flex -r br:6"), ...Base.boxShadow }}>
		{React.cloneElement(
			props.children,
			{ style: stylex("br-r:0"), type: !show ? "password" : "text" },
		)}
		<ShowButton style={stylex("no-flex-shrink br-l:0")} show={show} setShow={setShow} />
	</div>
)

export default WithShow