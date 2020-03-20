import Markdown from "./Markdown"
import React from "react"

import {
	CompoundNode,
	Node,
} from "./Node"

// const CodeBlock = React.memo(props => {
// 	let html = ""
// 	const lang = getPrismLang(props.lang)
// 	if (lang) {
// 		try {
// 			html = window.Prism.highlight(props.children, lang, props.lang)
// 		} catch (e) {
// 			console.warn(e)
// 		}
// 	}
// 	const className = `language-${props.lang}`
// 	return (
// 		<div style={{ ...stylex.parse("m-x:-24 p-x:24 b:white"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
// 			<Markdown style={stylex.parse("c:gray")} start={`\`\`\`${props.lang}`} end="```">
// 				{!html ? (
// 					<code>
// 						{props.children}
// 					</code>
// 				) : (
// 					<code className={className} dangerouslySetInnerHTML={{
// 						__html: html,
// 					}} />
// 				)}
// 			</Markdown>
// 		</div>
// 	)
// })

function areEqual(prev, next) {
	if (prev.metadata !== next.metadata) {
		return false
	} else if (prev.children.length !== next.children.length) {
		return false
	}
	const { length } = prev.children
	for (let x = 0; x < length; x++) {
		if (prev.children[x].key !== next.children[x].key ||
				prev.children[x].data.length !== next.children[x].data.length ||
				prev.children[x].data !== next.children[x].data) {
			return false
		}
	}
	return true
}

const CodeBlock = React.memo(props => {
	const parsed = props.children.map((each, index) => ({
		key:      each.key,
		atStart:  !index,
		atEnd:    index + 1 === props.children.length,
		/* eslint-disable-next-line no-nested-ternary */
		children: props.children.length === 1 ? each.data.slice(3, -3) : (
			!index || index + 1 === props.children.length
				? ""
				: each.data || <br />
		),
	}))
	// NOTE: Return null instead of false because Firefox is
	// known to create empty text nodes
	return (
		<CompoundNode className="code-block" /* style={{ whiteSpace: "pre" }} */ spellCheck={false}>
			{parsed.map((each, index) => (
				<Node
					key={each.key}
					reactKey={each.key}
					/* style={{ whiteSpace: "pre" }} */
					data-start-node={(parsed.length > 1 && !index) || null}
					data-end-node={(parsed.length > 1 && index + 1 === parsed.length) || null}
				>
					{/* <span> */}
					<Markdown
						start={each.atStart ? `\`\`\`${props.metadata}` : null}
						end={each.atEnd ? "```" : null}
					>
						{each.children}
					</Markdown>
					{/* </span> */}
				</Node>
			))}
		</CompoundNode>
	)
}, areEqual)

export default CodeBlock
