import Markdown from "./Markdown"
import React from "react"
import { Node } from "./Node"

const Break = React.memo(({ reactKey, ...props }) => (
	<Node reactKey={reactKey} className="break">
		<Markdown start={props.start} />
	</Node>
))

export default Break
