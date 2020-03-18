import * as Containers from "components/Containers"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"

// Returns a getter and setter for localStorage.
function newLocalStorage(key, initialState) {
	const getter = () => {
		return localStorage.getItem(key) || initialState
	}
	const setter = data => {
		localStorage.setItem(key, data)
	}
	return [getter, setter]
}

const Demo = props => {
	const [getLocalStorage, setLocalStorage] = newLocalStorage("codex-app", raw("./index.md"))

	const [state, dispatch] = Editor.useEditor(getLocalStorage(), {
		shortcuts: true, // TODO: Move to props
		statusBar: true, // FIXME
	})

	React.useEffect(() => {
		setLocalStorage(state.data)
	}, [setLocalStorage, state.data])

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
