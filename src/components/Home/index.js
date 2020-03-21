import * as constants from "__constants"
import * as Editor from "components/Editor"
import Link from "components/Link"
import Nav from "components/Nav"
import raw from "raw.macro"
import React from "react"

import "./index.css"

const EditorInstance = props => {
	const [state, dispatch] = Editor.useEditor(raw("./index.md"))

	const style = { padding: 24 }
	return <Editor.Editor state={state} dispatch={dispatch} readOnly style={style} />
}

const HeroEditor = props => {
	const ref = React.useRef()

	React.useLayoutEffect(() => {
		ref.current.classList.add("hero-editor-enter")
		const id = setTimeout(() => {
			ref.current.classList.add("hero-editor-active")
		}, 1e3)
		return () => {
			clearTimeout(id)
		}
	}, [])

	return (
		<div ref={ref} className="pb-4/5 relative">
			<div className="absolute inset-0">
				<div className="h-full bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-xl shadow-hero-xl overflow-y-scroll scrolling-touch">
					<EditorInstance />
				</div>
			</div>
		</div>
	)
}

const Home = props => (
	<React.Fragment>
		<Nav />
		<div className="py-40 flex flex-row justify-center min-h-full">
			<div className="px-6 flex flex-col lg:flex-row items-center w-full max-w-screen-lg">

				{/* LHS */}
				<div className="w-full max-w-lg text-center lg:text-left">
					<h1 className="font-inter font-semibold text-4xl tracking-tight leading-snug text-black dark:text-gray-100">
						Codex makes it easier than ever to express yourself in words <em>and</em> code
					</h1>
					<div className="h-12" />
					<Link to={constants.PATH_AUTH}>
						<p className="font-inter font-medium text-3xl tracking-tight text-md-blue-a400 dark:md-blue-a200">
							Open your Codex
						</p>
					</Link>
				</div>

				{/* RHS */}
				<div className="w-12 h-12" />
				<Link className="w-full" to={constants.PATH_DEMO}>
					<HeroEditor />
				</Link>

			</div>
		</div>
	</React.Fragment>
)

export default Home
