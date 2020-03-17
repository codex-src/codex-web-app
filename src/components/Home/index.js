import * as constants from "__constants"
import HeroEditor from "./HeroEditor"
import Link from "components/Link"
import Nav from "components/Nav"
import React from "react"

const Home = props => (
	// NOTE: Do not use <Containers.App>
	<React.Fragment>
		<Nav />
		<div className="py-40 flex flex-row justify-center min-h-full">
			<div className="px-6 flex flex-col lg:flex-row items-center w-full max-w-screen-lg">

				{/* LHS */}
				<div className="w-full max-w-lg text-center lg:text-left">
					<h1 className="font-bold text-4xl -tracking-px leading-snug">
						Codex makes it easier than ever to express yourself in words <em>and</em> code
					</h1>
					<div className="h-12" />
					<Link to={constants.PATH_AUTH}>
						<p className="font-medium text-3xl -tracking-px text-md-blue-a400">
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
