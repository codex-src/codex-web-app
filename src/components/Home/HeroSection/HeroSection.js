import HeroEditor from "./HeroEditor"
import Link from "utils/RouterLink"
import React from "react"

import "./HeroSection.css"

const HeroSection = props => (
	<div className="px-6 py-32 flex flex-row justify-center items-center min-h-screen">
		<div className="flex flex-col lg:flex-row items-center max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex flex-col lg:block md:items-start items-center">
				<h1 className="font-bold text-4xl -tracking-px leading-1.4">
					Codex makes it easier than ever to express yourself in words <em>and</em> code
				</h1>
				<div className="h-8" />
				<Link className="py-1 block" to="/demo" data-e2e="cta-btn-demo">
					<p className="font-medium text-2xl text-md-blue-a400">
						Try the editor! (alpha)
					</p>
				</Link>
				<Link className="py-1 block" to="/auth" data-e2e="cta-btn-auth">
					<p className="font-medium text-2xl text-md-blue-a400">
						Open your Codex
					</p>
				</Link>
			</div>

			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link className="w-full" to="demo" data-e2e="cta-editor">
				<HeroEditorSlate />
			</Link>

		</div>
	</div>
)

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

export default HeroSection
