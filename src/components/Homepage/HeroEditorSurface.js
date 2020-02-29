import * as constants from "__constants"
import HeroEditor from "./HeroEditor"
import Link from "components/Link"
import React from "react"
import useTransForwards from "utils/hooks/useTransitionForwards"

import "./HeroEditorSurface.css"

const HeroEditorSurface = props => {
	const ref = React.useRef()

	useTransForwards({
		ref,
		enterClass: "hero-editor-enter",
		activeClass: "hero-editor-active",
		delayMs: 1e3,
	})

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
