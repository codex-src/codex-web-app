// import * as Feather from "react-feather"
import Context from "../Context"
import getStatus from "./getStatus"
import React from "react"
import stylex from "stylex"

// Comma-formats a number.
function commaFormat({ count }) {
	return count.toLocaleString("en")
}

// Plural-formats a number; uses commas and a descriptor.
function pluralFormat({ count, desc }) {
	return `${commaFormat({ count })} ${desc}${count === 1 ? "" : "s"}`
}

// Gets the LHS string.
function getLHSString({ line, column, selectedLines, selectedCharacters }) {
	if (selectedCharacters.count) {
		if (selectedLines.count < 2) {
			return `Selected ${pluralFormat(selectedCharacters)}`
		}
		return `Selected ${pluralFormat(selectedLines)}, ${pluralFormat(selectedCharacters)}`
	}
	return `Line ${commaFormat(line)}, column ${commaFormat(column)}`
}

// Gets the RHS string.
function getRHSString({ words, duration }) {
	if (duration.count < 2) {
		// return `Est. ${pluralFormat(words)}`
		return pluralFormat(words)
	}
	// return `Est. ${pluralFormat(words)}, ${pluralFormat(duration)}`
	return `${pluralFormat(words)}, ${pluralFormat(duration)}`
}

// const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
// 	<Icon style={stylex.parse("sw:600 wh:12 c:white")} />
// ))

// TODO: Does **not** render the same font-weight on Gecko/
// Firefox
const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fw:600 fs:12 lh:100% c:white")} {...props}>
		{props.children}
	</p>
))

// boxShadow: "0px -1px hsl(var(--gray-200))"
function StatusBar(props) {
	const [state] = React.useContext(Context)

	const status = getStatus(state)

	return (
		<aside style={stylex.parse("fixed -x -b b:blue-a200 z:1")}>
			<div style={stylex.parse("p-x:24 flex -r -x:center")}>
				<div style={stylex.parse("p-y:4 flex -r -x:between w:1440")}>

					{/* LHS: */}
					<div style={stylex.parse("flex -r -y:center")}>
						{/* <Icon icon={Feather.Scissors} /> */}
						{/* <div style={stylex.parse("w:6")} /> */}
						<Text>
							{getLHSString(status)}
						</Text>
					</div>

					{/* RHS: */}
					<div style={stylex.parse("flex -r -y:center")}>
						<Text>
							{getRHSString(status)}
						</Text>
						{/* <div style={stylex.parse("w:6")} /> */}
						{/* <Icon icon={Feather.Bookmark} /> */}
					</div>

				</div>
			</div>
		</aside>
	)
}

export default StatusBar
