import * as Containers from "components/Containers"
import * as Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import ReactDOM from "react-dom"

const LS_KEY = "codex-app"

const Demo = props => {
	const [state, dispatch] = Editor.useEditor(localStorage.getItem(LS_KEY) || raw("./index.md"))
	const [saveStatus, setSaveStatus] = React.useState(null)

	const mounted = React.useRef()
	React.useEffect(() => {
		if (!mounted.current) {
			mounted.current = true
			return
		}
		setSaveStatus("Saving…")
		const id = setTimeout(() => {
			localStorage.setItem(LS_KEY, state.data)
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

	const style = { margin: "-160px 0", padding: "160px 0" }
	return (
		<Containers.Note>
			<Editor.Editor state={state} dispatch={dispatch} shortcuts style={style} />
		</Containers.Note>
	)
}

export default Demo
