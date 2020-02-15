import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import stylex from "stylex"

const LOCAL_STORAGE_KEY = "codex-app"

const initialValue = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./demo.md")

function Demo(props) {
	const [state, dispatch] = Editor.useEditor(initialValue)

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	return (
		// FIXME: Migrate to Tailwind CSS
		<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
			{/* Based on 2388 x 1668 */}
			<div style={stylex.parse("w:834 no-min-w")}>
				<Editor.Editor
					state={state}
					dispatch={dispatch}
					statusBars={true}
				/>
			</div>
		</div>
	)
}

export default Demo
