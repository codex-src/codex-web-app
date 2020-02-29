import * as constants from "__constants"
import Container from "components/Container"
import HeroEditorSurface from "./HeroEditorSurface"
import Link from "components/Link"
import React from "react"

const HeroSection = props => (
	<Container>
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
								Open your Codex
							</p>
						</Link>
					</div>
				</div>
			</div>

			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link className="w-full" to={constants.PATH_DEMO}>
				<HeroEditorSurface />
			</Link>

		</div>
	</Container>
)

export default HeroSection
