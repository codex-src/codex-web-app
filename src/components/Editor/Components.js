import Markdown from "./ComponentsText"
import React from "react"
import stylex from "stylex"

// TODO:
//
// - CompoundNode
// - Node

export const Header = React.memo(({ reactKey, ...props }) => (
	<div id={reactKey} style={stylex.parse("fw:700")} data-node data-memo={Date.now()}>
		<Markdown startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

export const Comment = React.memo(({ reactKey, ...props }) => (
	<div id={reactKey} style={stylex.parse("c:gray")} data-node data-memo={Date.now()} spellCheck={false}>
		<Markdown style={stylex.parse("c:gray")} startSyntax={props.startSyntax}>
			{props.children || (
				<br />
			)}
		</Markdown>
	</div>
))

export const Blockquote = React.memo(({ reactKey, ...props }) => (
	<div data-compound-node data-memo={Date.now()}>
		{props.children.map(each => (
			<div key={each.key} id={each.key} data-node>
				<Markdown startSyntax={each.startSyntax}>
					{each.data || (
						!(each.startSyntax + each.data) && (
							<br />
						)
					)}
				</Markdown>
			</div>
		))}
	</div>
))

const code = {
	tabSize: 2,
	font: "15px/1.375 'Monaco', 'monospace'", // 14.25?
}

// https://cdpn.io/PowjgOg
export const CodeBlock = React.memo(({ reactKey, ...props }) => {
	// Gets the start or end syntax.
	const getStartSyntax = index => !index && props.startSyntax
	const getEndSyntax = index => index + 1 === props.children.length && props.endSyntax

	return (
		<div
			style={{
				...stylex.parse("m-x:-24 p-y:16 pre b:gray-50 overflow -x:scroll"),
				...code,
				boxShadow: "0px 0px 1px hsl(var(--gray))",
			}}
			data-compound-node
			data-memo={Date.now()}
			spellCheck={false}
		>
			{props.children.map((each, index) => (
				<div key={each.key} id={each.key} style={stylex.parse("p-x:24")} data-node>
					<code style={{ ...stylex.parse("m-r:-24 p-r:24"), ...code }}>
						<Markdown startSyntax={getStartSyntax(index)} endSyntax={getEndSyntax(index)}>
							{each.data || (
								index > 0 && index + 1 < props.children.length && (
									<br />
								)
							)}
						</Markdown>
					</code>
				</div>
			))}
		</div>
	)
})

export const Paragraph = React.memo(({ reactKey, ...props }) => (
	<div id={reactKey} data-node data-memo={Date.now()}>
		{props.children || (
			<br />
		)}
	</div>
))

export const Break = React.memo(({ reactKey, ...props }) => (
	<div id={reactKey} style={stylex.parse("c:gray")} data-node data-memo={Date.now()} spellCheck={false}>
		<Markdown startSyntax={props.startSyntax} />
	</div>
))
