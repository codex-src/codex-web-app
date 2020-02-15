import Markdown from "./Markdown"
import React from "react"
import recurse from "./parseTextComponents"
import { Node } from "./Node"

const Header = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className={`header h${props.start.length - 1}`}>
		<Markdown start={props.start}>
			{recurse(props.children)}
		</Markdown>
	</Node>
))

export default Header
