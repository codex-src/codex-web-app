import React from "react"
import stylex from "stylex"
import Textarea from "components/Textarea"

const LOCALSTORAGE_KEY = "codex-textarea-app-0-1-0"

const _initialValue = `# Hello, world!

\`\`\`jsx
const AppContainer = props => (
	<DebugCSS>
		<div style={stylex.parse("flex -c -y:between h:max")}>
			<div style={stylex.parse("b:white")}>
				<Nav />
				<main style={stylex.parse("p-x:24 p-y:80 flex -r -x:center")}>
					<div style={stylex.parse("w:1024 no-min-w")}>
						{props.children}
					</div>
				</main>
			</div>
			<Footer />
		</div>
	</DebugCSS>
)
\`\`\`

## Hello, world!

\`\`\`js
{
  "compilerOptions": { "baseUrl": "src" },
  "include": ["src"]
}
\`\`\`

### Hello, world!`

const initialValue = localStorage.getItem(LOCALSTORAGE_KEY) || _initialValue

function TextareaEditorApp(props) {
	const [state, dispatch] = Textarea.useEditor(initialValue)

	React.useEffect(() => {
		localStorage.setItem(LOCALSTORAGE_KEY, state.data)
	}, [state.data])

	return (
		<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
			<div style={stylex.parse("w:768 no-min-w")}>
				<Textarea.Editor
					state={state}
					dispatch={dispatch}
					// scrollPastEnd
					// statusBar
					debugger
				/>
			</div>
		</div>
	)
}

export default TextareaEditorApp
