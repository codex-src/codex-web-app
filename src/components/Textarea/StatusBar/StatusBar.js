import * as Feather from "react-feather"
import getStatusInfo from "./getStatusInfo"
import React from "react"
import stylex from "stylex"
import { Context } from "../TextareaEditor"

// Comma-formats a number.
function commaFormat({ count }) {
	return count.toLocaleString("en")
}

// Plural-formats a number; uses commas and a descriptor.
function pluralFormat({ count, desc }) {
	return `${commaFormat({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// // Gets left-hand side (LHS) status info.
// function getLHSStatusInfo({ line, column, selectedLines, selectedCharacters }) {
// 	if (selectedCharacters.count) {
// 		if (selectedLines.count < 2) {
// 			return `Selected ${pluralFormat(selectedCharacters)}`
// 		}
// 		return `Selected ${pluralFormat(selectedLines)}, ${pluralFormat(selectedCharacters)}`
// 	}
// 	return `Line ${commaFormat(line)}, column ${commaFormat(column)}`
// }

// Gets right-hand side (RHS) status info.
function getRHSStatusInfo({ words, duration }) {
	if (duration.count < 2) {
		return pluralFormat(words)
	}
	return `${pluralFormat(words)}, ${pluralFormat(duration)}`
}

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:12.5")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fs:12.5 ls:0.625% lh:100%")} {...props}>
		{props.children}
	</p>
))

function StatusBar(props) {
	const [state] = React.useContext(Context)

	const status = getStatusInfo(state)

	return (
		<aside style={{ ...stylex.parse("fixed -x -b b:gray-100 z:1"), boxShadow: "0px -1px hsl(var(--gray-200))" }}>
			<div style={stylex.parse("p-x:24 flex -r -x:center")}>
				<div style={stylex.parse("flex -r -x:between w:1440 h:24")}>

					<div style={stylex.parse("flex -r -y:center")}>
						<Icon icon={Feather.Scissors} />
						<div style={stylex.parse("w:6.25")} />
						<Text>
							TODO
						</Text>
						{/* TODO: Add the current operation? */}
					</div>

					<div style={stylex.parse("flex -r -y:center")}>
						<Text>
							{getRHSStatusInfo(status)}
						</Text>
						<div style={stylex.parse("w:6.25")} />
						<Icon icon={Feather.Hash} />
					</div>

				</div>
			</div>
		</aside>
	)
}

export default StatusBar
