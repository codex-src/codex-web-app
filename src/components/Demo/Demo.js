import Editor from "components/Editor"
// import EditorDemo from "./EditorDemo"
import EditorReadme from "./EditorReadme"
import raw from "raw.macro"
import React from "react"
import Toolbar from "./Toolbar"
import useEscape from "./hooks/useEscape"
import useToolbar from "./Toolbar/useToolbar"

import "./Demo.css"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")

function WithReadme({ open, ...props }) {
	const ref = React.useRef()

	const didMount = React.useRef()
	React.useEffect(() => {
		// if (!didMount.current) {
		// 	didMount.current = true
		// 	return
		// }
		if (!open) {
			setTimeout(() => {
				ref.current.classList.remove("readme-editor-active")
			}, 25)
		} else {
			setTimeout(() => {
				ref.current.classList.add("readme-editor-active")
			}, 25)
		}
	}, [open])

	return (
		<div>
			<div className="fixed right-0 inset-y-0 z-30 pointer-events-none">
				<div ref={ref} className="readme-editor-enter p-6 w-full max-w-md max-h-full bg-white rounded-xl shadow-hero-xl z-30 overflow-y-scroll scrolling-touch pointer-events-auto">
					<EditorReadme />
				</div>
			</div>
			{props.children}
		</div>
	)
}

function Demo(props) {
	const editor = Editor.useEditor(demo, { shortcuts: true /* statusBar: true */ })

	// React.useEffect(
	// 	React.useCallback(() => {
	// 		localStorage.setItem(LOCAL_STORAGE_KEY, editor[0].data)
	// 	}, [editor[0]]),
	// 	[editor[0].data],
	// )

	const toolbar = useToolbar()
	useEscape(toolbar[0].readme, on => {
		toolbar[1].setProperty("readme", on)
	})

	return (
		<WithReadme open={toolbar[0].readme}>
			<div className="py-12 md:py-24 flex flex-row justify-center">
				<div className="p-6 max-w-4xl bg-white">
					<Editor.Editor state={editor[0]} dispatch={editor[1]} />
				</div>
			</div>
			<Toolbar editor={editor} state={toolbar[0]} dispatch={toolbar[1]} />
		</WithReadme>
	)
}

export default Demo
