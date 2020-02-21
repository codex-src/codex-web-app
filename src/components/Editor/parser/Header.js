import Markdown from "./Markdown"
import parseText from "./parseText"
import React from "react"
import { Node } from "./Node"

const Header = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className={`header h${props.start.length - 1}`}>
		<Markdown start={props.start}>
			{parseText(props.children)}
		</Markdown>
	</Node>
))

export default Header
