import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

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
		<div className="px-6 py-32 flex justify-center">
			<div style={{ maxWidth: 834 }}>
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
