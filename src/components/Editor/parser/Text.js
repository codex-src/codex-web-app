import Markdown from "./Markdown"
import React from "react"

export const Em = ({ syntax, ...props }) => (
	<span className="em">
		<Markdown start={syntax} end={syntax}>
			{props.children}
		</Markdown>
	</span>
)

export const Strong = ({ syntax, ...props }) => (
	<span className="strong">
		<Markdown start={syntax} end={syntax}>
			{props.children}
		</Markdown>
	</span>
)

export const StrongEm = ({ syntax, ...props }) => (
	<span className="strong em">
		<Markdown start={syntax.slice(0, 2)} end={syntax.slice(1)}>
			<Markdown start={syntax.slice(-1)} end={syntax.slice(0, 1)}>
				{props.children}
			</Markdown>
		</Markdown>
	</span>
)

export const Code = props => (
	<span className="code" spellCheck={false}>
		<Markdown start="`" end="`" >
			{props.children}
		</Markdown>
	</span>
)

export const Strikethrough = ({ syntax, ...props }) => (
	<span className="strikethrough">
		<Markdown start={syntax} end={syntax} >
			{props.children}
		</Markdown>
	</span>
)
