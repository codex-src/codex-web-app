import HeroEditor from "./HeroEditor"
import Link from "utils/RouterLink"
import Nav2 from "components/Nav2"
import React from "react"

import "./Marketing.css"

const Hero = props => (
	<section className="px-6 py-32 flex justify-center items-center min-h-screen bg-gray-50">
		<div className="flex lg:flex-row flex-col items-center max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex lg:block flex-col md:items-start items-center">
				<h1 className="font-700 text-4xl leading-1.4">
					Codex makes it easier than ever to express yourself in words <em>and</em> code
				</h1>
				<div className="h-8" />
				<Link
					className="py-1 block"
					to="/demo"
					data-e2e="cta-btn"
				>
					<p className="font-500 text-2xl text-brand">
						Try the editor alpha!
					</p>
				</Link>
				{/* <Link */}
				{/* 	className="py-1 block" */}
				{/* 	to="#features" */}
				{/* > */}
				{/* 	<p className="font-500 text-2xl text-brand"> */}
				{/* 		Learn more */}
				{/* 	</p> */}
				{/* </Link> */}
			</div>

			{/* Spacer: */}
			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link
				className="w-full"
				to="demo"
				data-e2e="cta-editor"
			>
				<HeroEditorSurface />
			</Link>

		</div>
	</section>
)

function HeroEditorSurface(props) {
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

const Marketing = props => (
	<div>
		<Nav2 background="bg-gray-50" />
		<Hero />
	</div>
)

export default Marketing
