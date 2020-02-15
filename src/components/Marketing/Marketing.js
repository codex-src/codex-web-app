import Editor from "components/Editor"
// import Link from "utils/RouterLink"
import Nav2 from "components/Nav2"
import raw from "raw.macro"
import React from "react"
import { Link } from "react-router-dom"

import "./Marketing.css"

const Hero = props => (
	<section className="px-6 py-32 flex justify-center items-center min-h-screen">
		<div className="flex lg:flex-row flex-col items-center w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex lg:block flex-col md:items-start items-center">
				<h1 className="font-bold text-4xl">
					Codex makes it easier than ever to express yourself in words <em>and</em> code
				</h1>
				<div className="h-8" />
				<Link
					to="/demo"
					className="py-1 block"
				>
					<p className="font-medium text-2xl text-brand">
						Try the editor alpha!
					</p>
				</Link>
				<Link
					to="#features"
					className="py-1 block"
				>
					<p className="font-medium text-2xl text-brand">
						Learn more
					</p>
				</Link>
			</div>

			{/* Spacer: */}
			<div className="w-24 h-12" />

			{/* RHS: */}
			<div className="w-full">
				<HeroEditor />
			</div>

		</div>
	</section>
)

const preferences = {
	inlineBackground: true,
	// placeholder: false,
	readOnly: true, // FIXME
	shortcuts: false,
	statusBars: false,
}

function HeroEditor(props) {
	// TODO: Show markdown background
	const [state, dispatch] = Editor.useEditor(raw("./Marketing.md"), preferences)

	return (
		// Preserve aspect ratio:
		<Link to="https://google.com">
			<div id="marketing-editor" className="pb-4/5 relative">
				<div className="absolute inset-0">
					{/* Two shadows: */}
					<div className="h-full rounded-xl shadow-xs">
						<div className="px-6 py-4 h-full bg-white rounded-xl shadow-xl overflow-y-scroll scrolling-touch">
							<Editor.Editor
								state={state}
								dispatch={dispatch}
							/>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

const Marketing = props => (
	<React.Fragment>
		<Nav2 />
		<Hero />
	</React.Fragment>
)

export default Marketing
