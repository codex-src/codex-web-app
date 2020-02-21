import CSSDebugger from "utils/CSSDebugger"
import React from "react"

const EditorDebugger = ({ state, ...props }) => (
	<CSSDebugger>
		<div className="mt-6 whitespace-pre-wrap tabs-2 font-mono text-xs leading-1.3">
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
	</CSSDebugger>
)

export default EditorDebugger
