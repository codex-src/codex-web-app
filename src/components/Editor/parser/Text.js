import Markdown from "./Markdown"
import React from "react"

export const Em = props => (
	<span className="em">
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</span>
)

export const Strong = props => (
	<span className="strong">
		<Markdown start={props.syntax} end={props.syntax}>
			{props.children}
		</Markdown>
	</span>
)

export const StrongEm = props => (
	<span className="strong em">
		<Markdown start={props.syntax.slice(0, 2)} end={props.syntax.slice(1)}>
			<Markdown start={props.syntax.slice(-1)} end={props.syntax.slice(0, 1)}>
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

export const Strikethrough = props => (
	<span className="strikethrough">
		<Markdown start={props.syntax} end={props.syntax} >
			{props.children}
		</Markdown>
	</span>
)
