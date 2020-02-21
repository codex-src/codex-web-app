import React from "react"

// TODO: Deprecate data-empty-node
export const CompoundNode = ({ style, ...props }) => (
	<div
		style={{ whiteSpace: "pre-wrap", ...style }}
		data-compound-node
		{...props}
	>
		{props.children || (
			<br />
		)}
	</div>
)

// TODO: Deprecate data-empty-node
export function Node({ reactKey, style, ...props }) {
	if (!reactKey) {
		throw new Error("FIXME")
	}
	return (
		<div
			style={{ whiteSpace: "pre-wrap", ...style }}
			data-node={reactKey}
			data-empty-node={!props.children || null}
			{...props}
		>
			{props.children || (
				<br />
			)}
		</div>
	)
}
