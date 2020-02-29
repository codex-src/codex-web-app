import * as constants from "__constants"
import HeroEditor from "./HeroEditor"
import Link from "utils/RouterLink"
import React from "react"
import useTransitionForwards from "utils/hooks/useTransitionForwards"

import "./HeroSection.css"

const HeroEditorSlate = props => {
	const ref = React.useRef()

	useTransitionForwards({
		ref,
		state: true,
		enterClass: "hero-editor-enter",
		activeClass: "hero-editor-active",
		delayMs: 1e3,
		// durationMs: 1e3,
	})

	// React.useEffect(() => {
	// 	ref.current.classList.add("hero-editor-enter")
	// 	setTimeout(() => {
	// 		if (!ref.current) {
	// 			// No-op
	// 			return
	// 		}
	// 		ref.current.classList.add("hero-editor-active")
	// 	}, 1e3)
	// }, [])

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
			<div className="w-full">
				<div className="flex flex-col lg:block md:items-start items-center">
					<h1 className="font-brand-sans text-4xl leading-snug" style={{ fontWeight: 650 }}>
						Codex makes it easier than ever to express yourself in words <em>and</em> code
					</h1>
					<div className="mt-8">
						<Link className="py-1 block" to={constants.PATH_AUTH}>
							<p className="font-brand-sans text-2.5xl text-md-blue-a400" style={{ fontWeight: 550 }}>
								Sign up now!
							</p>
						</Link>
					</div>
				</div>
			</div>

			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link className="w-full" to={constants.PATH_DEMO}>
				<HeroEditorSlate />
			</Link>

		</div>
	</div>
)

export default HeroSection
