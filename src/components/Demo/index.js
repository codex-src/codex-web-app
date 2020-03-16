import Editor from "components/Editor"
import Nav from "components/Nav"
import React from "react"

const LOCALSTORAGE_KEY = "codex-app"

const data = localStorage.getItem(LOCALSTORAGE_KEY) || "# Hello, world!"

const Demo = props => {
	const [state, dispatch] = Editor.useEditor(data, {
		id: "editor",
		shortcuts: true,
		statusBar: true,
	})

	React.useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_KEY, state.data)
	}, [state.data])

	return (
		<React.Fragment>
			<Nav />
			<div className="flex flex-row justify-center min-h-full">
				<div className="px-6 w-full max-w-screen-md">
					<Editor.Editor
						state={state}
						dispatch={dispatch}
						paddingX={24}
						paddingY={128}
					/>
				</div>
			</div>
		</React.Fragment>
	)
}

export default Demo
