import Editor from "components/Editor"
import React from "react"
import Readme from "./Readme"
import Toolbar from "./Toolbar"

const LOCALSTORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCALSTORAGE_KEY) || ""

const Demo = props => {
	const [state, dispatch] = Editor.useEditor(demo, {
		paddingX:  24,
		paddingY:  128,
		readme:    true,
		shortcuts: true,
		statusBar: true,
		toolbar:   true,
	})

	React.useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_KEY, state.data)
	}, [state.data])

	return (
		<React.Fragment>
			<div className="flex flex-row justify-center">
				<div className="w-full max-w-4xl bg-white">
					<Editor.Editor state={state} dispatch={dispatch} />
				</div>
			</div>
			<Readme state={state} dispatch={dispatch} />
			<Toolbar state={state} dispatch={dispatch} />
		</React.Fragment>
	)
}

export default Demo
