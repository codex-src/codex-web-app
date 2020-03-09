// import * as Feather from "react-feather"
import React from "react"
import ReadmeEditor from "./ReadmeEditor"
import useEscape from "hooks/useEscape"
import useFixed from "hooks/useFixed"

import "./Readme.css"

// const X = props => (
// 	<div
// 		className="p-2 text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 rounded-full cursor-pointer"
// 		onClick={props.onClick}
// 	>
// 		<Feather.X className="p-px w-5 h-5 stroke-500" />
// 	</div>
// )

// {/* Hover: */}
// <div className="absolute right-full inset-y-0">
// 	<div className="w-12 h-full" />
// </div>

const Readme = ({ state, dispatch, ...props }) => {
	const ref = React.useRef()

	useEscape(state.prefs.readme, dispatch.toggleReadme)
	useFixed()

	React.useEffect(() => {
		if (!state.prefs.readme) {
			ref.current.classList.remove("readme-editor-active")
		} else {
			ref.current.classList.add("readme-editor-active")
		}
	}, [state.prefs.readme])

	return (
		<div className="p-6 fixed right-0 inset-y-0 transform translate-x-full z-30">
			<div ref={ref} className="readme-editor-enter p-6 w-full max-w-md max-h-full bg-white rounded-xl shadow-hero-xl z-30 overflow-y-scroll scrolling-touch">
				{/* <div className="p-6 absolute right-0 top-0"> */}
				{/* 	<X onClick={dispatch.toggleReadme} /> */}
				{/* </div> */}
				<div className="flex flex-row justify-center">
					<div className="w-full max-w-4xl bg-white">
						<ReadmeEditor />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Readme
