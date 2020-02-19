import EditorDemo from "./EditorDemo"
import EditorReadme from "./EditorReadme"
import React from "react"
import Toolbar from "./Toolbar"
import useEscape from "./hooks/useEscape"
import useToolbar from "./Toolbar/useToolbar"

const WithReadme = ({ open, ...props }) => (
	<React.Fragment>
		{open && (
			<div className="!p-6 fixed right-0 inset-y-0 z-30 pointer-events-none">
				<div className="p-6 w-full max-w-md max-h-full bg-white rounded-xl shadow-hero-xl z-30 overflow-y-scroll scrolling-touch transform scale-90 pointer-events-auto">
					<EditorReadme />
				</div>
			</div>
		)}
		{props.children}
	</React.Fragment>
)

function Demo(props) {
	const [state, dispatch] = useToolbar()
	useEscape(state.readme, on => {
		dispatch.setProperty("readme", on)
	})

	return (
		<WithReadme open={state.readme}>
			<div className="py-12 md:py-24 flex flex-row justify-center">
				<div className="p-6 max-w-3xl bg-white">
					<EditorDemo />
				</div>
			</div>
			<Toolbar state={state} dispatch={dispatch} />
		</WithReadme>
	)
}

export default Demo
