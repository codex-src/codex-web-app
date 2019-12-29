import * as Feather from "react-feather"
import React from "react"
import stylex from "stylex"

// `formatCommas` formats a number with commas.
function formatCommas({ count }) {
	return count.toLocaleString("en")
}

// `formatPlural` formats a number with commas and a
// descriptor as singular or plural.
function formatPlural({ count, desc }) {
	return `${formatCommas({ count })} ${desc}${count < 2 ? "" : "s"}`
}

// `computeLHS` computes the selection string or the
// insertion point string.
function computeLHS({ lines, characters, columns }) {
	// Compute selection:
	if (characters.count) { // Infers selection.
		if (lines < 2) {
			return `Selected ${formatCommas(characters)}`
		}
		return `Selected ${formatPlural(lines)}, ${formatPlural(characters)}`
	}
	// Compute insertion point:
	return `Line ${formatCommas(lines)}, column ${formatCommas(columns)}`
}

// `computeRHS` computes the rounded up word count and
// rounded up duration (in minutes).
function computeRHS({ words, duration }) {
	if (duration.count < 2) {
		return formatPlural(words)
	}
	return `${formatPlural(words)}, ${formatPlural(duration)}`
}

function computeMetrics(state) {
	const count = {
		lines:      countLines(state),
		columns:    countColumns(state),
		characters: countCharacters(state),
		words:      countWords(state),
		duration:   countDuration(state),
	}
	return count
}

function countLines(state) {
	const count = state.pos1.index + 1
	return { count, desc: "line" }
}

function countColumns(state) {
	const count = state.pos1.offset + 1
	return { count, desc: "column" }
}

function countCharacters(state) {
	const count = state.pos2.pos - state.pos1.pos
	return { count, desc: "character" }
}

function countWords(state) {
	const count = Math.ceil(state.body.data.length / 6)
	return { count, desc: "word" }
}

// TODO: Add hours?
function countDuration(state) {
	const count = Math.ceil(state.body.data.length / 6 / 200) // 200: WPM.
	return { count, desc: "minute" }
}

/*
 *
 */

const Icon = stylex.Styleable(({ icon: Icon, ...props }) => (
	<Icon style={stylex.parse("wh:12.5")} />
))

const Text = stylex.Styleable(props => (
	<p style={stylex.parse("tnum fs:12.5 ls:0.625% lh:100%")} {...props}>
		{props.children}
	</p>
))

// FIXME: `React.useContext`?
function StatusBar({ state, dispatch, ...props }) {
	const metrics = computeMetrics(state)

	return (
		<div style={{ ...stylex.parse("fixed -x -b b:gray-100 z:1 no-pointer-events"), boxShadow: "0px -1px hsl(var(--gray-200))" }}>
			<div style={stylex.parse("p-x:24 flex -r -x:center")}>
				<div style={stylex.parse("p-y:10 flex -r -x:between -y:center w:1024")}>

					{/* LHS */}
					<div style={stylex.parse("flex -r -y:center")}>
						<Icon icon={Feather.Scissors} />
						<div style={stylex.parse("w:6.25")} />
						<Text>
							{computeLHS(metrics)}
						</Text>
					</div>

					{/* RHS */}
					<div style={stylex.parse("flex -r -y:center")}>
						<Text>
							{computeRHS(metrics)}
						</Text>
						<div style={stylex.parse("w:6.25")} />
						<Icon icon={Feather.Clock} />
					</div>

				</div>
			</div>
		</div>
	)
}

export default StatusBar
