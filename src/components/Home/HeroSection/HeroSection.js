import * as constants from "__constants"
import HeroEditor from "./HeroEditor"
import Link from "utils/RouterLink"
import React from "react"

import "./HeroSection.css"

const HeroEditorSlate = props => {
	const ref = React.useRef()

	React.useEffect(() => {
		ref.current.classList.add("hero-editor-enter")
		setTimeout(() => {
			if (!ref.current) {
				// No-op
				return
			}
			ref.current.classList.add("hero-editor-active")
		}, 1e3)
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

const HeroSection = props => (
	<div className="px-6 py-32 flex flex-row justify-center items-center min-h-screen">
		<div className="flex flex-col lg:flex-row items-center w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex flex-col lg:block md:items-start items-center">
				<h1 className="font-bold text-4xl -tracking-px leading-1.4">
					Codex makes it easier than ever to express yourself in words <em>and</em> code
				</h1>
				{/* NOTE: block is needed because of lg:block */}
				<div className="h-8" />
				<Link className="py-2 block" to={constants.PATH_AUTH} data-e2e="cta-btn-auth">
					<p className="font-medium text-2xl text-md-blue-a400">
						Try Codex for free!
					</p>
				</Link>
			</div>

			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link className="w-full" to={constants.PATH_DEMO} data-e2e="cta-editor">
				<HeroEditorSlate />
			</Link>

		</div>
	</div>
)

export default HeroSection
