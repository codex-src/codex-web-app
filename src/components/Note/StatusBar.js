import * as Feather from "react-feather"
import React from "react"
import stylex from "stylex"

function format(n, desc = "") {
	const commas = n.toLocaleString("en")
	if (!desc) {
		return commas
	}
	return `${commas} ${desc}${n === 1 ? "" : "s"}`
}

// FIXME: `React.useContext`?
function computeLHS({ pos1, pos2 }) {
	if (pos1.pos !== pos2.pos) {
		const [lines, characters] = [pos2.index - pos1.index + 1, pos2.pos - pos1.pos]
		if (lines < 2) {
			return `Selected ${format(characters, "character")}`
		}
		return `Selected ${format(lines, "line")}, ${format(characters, "character")}`
	}
	const [line, column] = [pos1.index + 1, pos1.offset + 1]
	return `Line ${format(line)}, column ${format(column)}`
}

// FIXME: `React.useContext`?
function computeRHS({ body: { data } }) {
	const [words, minutes] = [Math.ceil(data.length / 6), Math.ceil(data.length / 6 / 200)]
	if (minutes < 2) {
		return format(words, "word")
	}
	return `${format(words, "word")}, ${format(minutes, "minute")}`
}

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:12.5")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fs:12.5 ls:0.625% lh:100%")} {...props}>
		{props.children}
	</p>
))

const StatusBar = ({ state, dispatch, ...props }) => (
	<div style={{ ...stylex.parse("fixed -x -b b:gray-100 z:1 no-pointer-events"), boxShadow: "0px -1px hsl(var(--gray-200))" }}>
		<div style={stylex.parse("p-x:24 flex -r -x:center")}>
			<div style={stylex.parse("p-y:10 flex -r -x:between -y:center w:1024")}>

				{/* LHS */}
				<div style={stylex.parse("flex -r -y:center")}>
					<Icon icon={Feather.Scissors} />
					<div style={stylex.parse("w:6.25")} />
					<Text>
						{computeLHS(state)}
					</Text>
				</div>

				{/* RHS */}
				<div style={stylex.parse("flex -r -y:center")}>
					<Text>
						{computeRHS(state)}
					</Text>
					<div style={stylex.parse("w:6.25")} />
					<Icon icon={Feather.Clock} />
				</div>

			</div>
		</div>
	</div>
)

export default StatusBar
