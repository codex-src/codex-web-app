import * as Title from "utils/Title"
import React from "react"

const CodexTitle = ({ title, ...props }) => (
	<Title.Effect title={!title ? "Codex" : `${title} – Codex`}>
		{props.children}
	</Title.Effect>
)

export default CodexTitle
