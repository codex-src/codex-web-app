// import * as Feather from "react-feather"
import Context from "../Context"
import getStatus from "./getStatus"
import React from "react"
import stylex from "stylex"

import {
	getStatusStringLHS,
	getStatusStringRHS,
} from "./getStatusString"

const TextBox = stylex.Styleable(props => (
	<div style={stylex.parse("p-x:16 h:32 flex -r :center b:gray-100 br:max pointer-events")}>
		{props.children}
	</div>
))

// const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
// 	<Icon style={stylex.parse("sw:500 wh:14 c:gray-900")} />
// ))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fw:500 fs:12.5 c:gray-900")}>
		{props.children}
	</p>
))

function StatusBars(props) {
	const [state] = React.useContext(Context)

	const status = getStatus(state)
	return (
		/* eslint-disable jsx-a11y/accessible-emoji */
		<aside style={stylex.parse("p-x:16 p-y:12 fixed -x -b z:1 no-pointer-events")}>
			<div style={stylex.parse("flex -r -x:center")}>
				<div style={stylex.parse("flex -r -x:between w:1440")}>
					<TextBox>
						<Text>
							✂️{"\u00a0\u00a0"}
							{getStatusStringLHS(state, status)}
						</Text>
					</TextBox>
					<TextBox>
						<Text>
							{getStatusStringRHS(state, status)}{"\u00a0\u00a0"}
							⌛️
						</Text>
					</TextBox>
				</div>
			</div>
		</aside>
	)
}

export default StatusBars
