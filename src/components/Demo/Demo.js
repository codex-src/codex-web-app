// import EditorDemo from "./EditorDemo"
import * as Feather from "react-feather"
import Editor from "components/Editor"
import EditorReadme from "./EditorReadme"
import raw from "raw.macro"
import React from "react"
import Toolbar from "./Toolbar"
import useEscape from "./hooks/useEscape"
import useToolbar from "./Toolbar/useToolbar"

import "./Demo.css"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")

function WithReadme({ readme, setReadme, ...props }) {
	const ref = React.useRef()
	const didPointerEnter = React.useRef()

	React.useEffect(() => {
		if (!readme) {
			ref.current.classList.remove("readme-editor-active")
		} else {
			ref.current.classList.add("readme-editor-active")
		}
	}, [readme])

	const handlePointerEnter = e => {
		if (readme) {
			// No-op
			return
		}
		setReadme(true)
		didPointerEnter.current = true
	}
	const handlePointerLeave = e => {
		if (!didPointerEnter.current) {
			// No-op
			return
		}
		setReadme(false)
		didPointerEnter.current = false // Reset
	}

	return (
		<div>
			<div
				className="p-6 fixed right-0 inset-y-0 transform translate-x-full z-30"
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				<div className="absolute right-full inset-y-0">
					<div className="w-12 h-full" />
				</div>
				{/* Readme: */}
				<div
					ref={ref}
					className="readme-editor-enter p-6 w-full max-w-md max-h-full bg-white rounded-xl shadow-hero-xl z-30 overflow-y-scroll scrolling-touch"
				>
					{/* X: */}
					<div className="p-6 absolute right-0 top-0">
						<div className="p-2 text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 rounded-full cursor-pointer" onClick={e => setReadme(false)}>
							<Feather.X className="p-px w-5 h-5 stroke-500" />
						</div>
					</div>
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
		<WithReadme readme={toolbar[0].readme} setReadme={on => toolbar[1].setProperty("readme", on)}>
			<div className="py-12 md:py-24 flex flex-row justify-center">
				<div className="w-full max-w-4xl p-6 bg-white">
					<Editor.Editor state={editor[0]} dispatch={editor[1]} />
				</div>
			</div>
			<Toolbar editor={editor} state={toolbar[0]} dispatch={toolbar[1]} />
		</WithReadme>
	)
}

export default Demo
