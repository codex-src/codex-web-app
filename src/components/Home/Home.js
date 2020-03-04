import * as constants from "__constants"
import HeroEditorSurface from "./HeroEditorSurface"
import Link from "components/Link"
import Nav from "components/Nav"
import React from "react"

const Container = props => (
	<div className="py-40 flex flex-row justify-center min-h-full">
		<div className="px-6 flex flex-col lg:flex-row lg:items-center w-full max-w-screen-lg">
			{props.children}
		</div>
	</div>
)

const SectionHero = props => (
	<Container>

		{/* LHS */}
		<div className="flex-1">
			<h1 className="text-center md:text-left font-bold text-4xl -tracking-px leading-snug">
				Codex makes it easier than ever to express yourself in words <em>and</em> code
			</h1>
			<div className="h-12" />
			<Link to={constants.PATH_AUTH}>
				<p className="text-center lg:text-left font-medium text-3xl -tracking-px text-md-blue-a400">
					Open your Codex
				</p>
			</Link>
		</div>

		{/* RHS */}
		<div className="h-12" />
		<Link className="flex-1" to={constants.PATH_DEMO}>
			<HeroEditorSurface />
		</Link>

	</Container>
)

const Home = props => (
	<React.Fragment>
		<Nav />
		<SectionHero />
	</React.Fragment>
)

export default Home
