import HeroEditor from "./HeroEditor"
import React from "react"

import "./HeroEditorSurface.css"

const enterClass  = "hero-editor-enter"  // eslint-disable-line no-multi-spaces
const activeClass = "hero-editor-active" // eslint-disable-line no-multi-spaces

const HeroEditorSurface = props => {
	const ref = React.useRef()

	React.useLayoutEffect(() => {
		ref.current.classList.add(enterClass)
		const id = setTimeout(() => {
			ref.current.classList.add(activeClass)
		}, 1e3)
		return () => {
			clearTimeout(id)
		}
	}, [])

	return (
		<div ref={ref} className="pb-4/5 relative">
			<div className="absolute inset-0">
				<div className="h-full bg-white rounded-xl shadow-hero-xl overflow-y-scroll scrolling-touch">
					<HeroEditor />
				</div>
			</div>
		</div>
	)
}

export default HeroEditorSurface
