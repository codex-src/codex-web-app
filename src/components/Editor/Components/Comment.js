import Markdown from "./Markdown"
import React from "react"
import recurse from "./parseTextComponents"
import { Node } from "./Node"

const Comment = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className="comment" spellCheck={false}>
		<Markdown start={props.start}>
			{recurse(props.children)}
		</Markdown>
	</Node>
))

export default Comment
