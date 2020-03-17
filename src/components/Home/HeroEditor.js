import EditorInstance from "./EditorInstance"
import React from "react"

import "./HeroEditor.css"

const enterClass  = "hero-editor-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "hero-editor-active" // eslint-disable-line no-multi-spaces
const delayMs     = 1e3                  // eslint-disable-line no-multi-spaces

const HeroEditor = props => {
	const ref = React.useRef()

	React.useLayoutEffect(() => {
		ref.current.classList.add(enterClass)
		const id = setTimeout(() => {
			ref.current.classList.add(activeClass)
		}, delayMs)
		return () => {
			clearTimeout(id)
		}
	}, [])

	return (
		<div ref={ref} className="pb-4/5 relative">
			<div className="absolute inset-0">
				<div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-hero-xl overflow-y-scroll scrolling-touch">
					<EditorInstance />
				</div>
			</div>
		</div>
	)
}

export default HeroEditor
