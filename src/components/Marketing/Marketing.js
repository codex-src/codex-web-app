import Editor from "components/Editor"
import Link from "utils/RouterLink"
import Nav2 from "components/Nav2"
import raw from "raw.macro"
import React from "react"

import "./Marketing.css"

const Hero = props => (
	<section className="px-6 py-32 flex justify-center items-center min-h-screen bg-gray-50">
		<div className="flex lg:flex-row flex-col items-center max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex lg:block flex-col md:items-start items-center">
				<h1 className="font-bold text-4xl leading-1.4">
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
				{/* <Link */}
				{/* 	to="#features" */}
				{/* 	className="py-1 block" */}
				{/* > */}
				{/* 	<p className="font-medium text-2xl text-brand"> */}
				{/* 		Learn more */}
				{/* 	</p> */}
				{/* </Link> */}
			</div>

			{/* Spacer: */}
			<div className="w-24 h-12" />

			{/* RHS: */}
			<Link
				to="demo"
				className="w-full"
			>
				<HeroEditor />
			</Link>

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
	const ref = React.useRef()

	const [state, dispatch] = Editor.useEditor(raw("./Marketing.md"), preferences)

	React.useEffect(() => {
		ref.current.classList.add("hero-editor-enter")
		setTimeout(() => {
			ref.current.classList.add("hero-editor-active")
		}, 0)
	}, [])

	return (
		<div ref={ref} className="pb-4/5 relative">
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
	)
}

const Marketing = props => (
	<React.Fragment>
		<Nav2 background="bg-gray-50" />
		<Hero />
	</React.Fragment>
)

export default Marketing
