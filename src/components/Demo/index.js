import * as Containers from "components/Containers"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import ReactDOM from "react-dom"

const Demo = props => {
	const [state, dispatch] = Editor.useEditor(localStorage.getItem("codex-app") || raw("./index.md"), {
		shortcuts: true, // TODO: Move to props
		statusBar: true, // FIXME
	})

	const [saveStatus, setSaveStatus] = React.useState(null)

	const mounted = React.useRef()
	React.useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		setSaveStatus("Saving…")
		const id = setTimeout(() => {
			localStorage.setItem("codex-app", state.data)
			setSaveStatus("Saved")
		}, 500)
		return () => {
			clearTimeout(id)
		}
	}, [state.data])

	React.useEffect(() => {
		ReactDOM.render(
			saveStatus,
			document.getElementById("note-save-status"),
		)
	}, [saveStatus])

	return (
		<Containers.Note>
			<Editor.Editor
				state={state}
				dispatch={dispatch}
				style={{ margin: "-160px 0", padding: "160px 0" }}
			/>
		</Containers.Note>
	)
}

export default Demo
