import React from "react"

const EditorDebugger = ({ state, ...props }) => (
	<div className="mt-6 whitespace-pre-wrap tabs-2 font-mono text-xs leading-snug">
		{JSON.stringify(
			{
				// history: state.history,

				...state,
				components: undefined,
				reactDOM: undefined,
			},
			null,
			"\t",
		)}
	</div>
)

export default EditorDebugger
