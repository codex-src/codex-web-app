import * as Feather from "react-feather"
import Editor from "components/Editor"
import EditorDemo from "./EditorDemo"
import EditorReadme from "./EditorReadme"
import React from "react"
import useEscape from "./hooks/useEscape"

import "./Demo.css"

const WithReadmeSurface = ({ readme, setReadme, ...props }) => {
	const ref = React.useRef()
	const didPointerEnter = React.useRef()

	React.useEffect(() => {
		if (!readme) {
			ref.current.classList.remove("readme-editor-active")
		} else {
			ref.current.classList.add("readme-editor-active")
		}
	}, [readme])

	const handlePointerEnter = e => {
		if (readme) {
			// No-op
			return
		}
		setReadme(true)
		didPointerEnter.current = true
	}
	const handlePointerLeave = e => {
		if (!didPointerEnter.current) {
			// No-op
			return
		}
		setReadme(false)
		didPointerEnter.current = false // Reset
	}

	return (
		<div>
			<div
				className="p-6 fixed right-0 inset-y-0 transform translate-x-full z-30"
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				<div className="absolute right-full inset-y-0">
					<div className="w-12 h-full" />
				</div>
				{/* Readme: */}
				<div
					ref={ref}
					className="readme-editor-enter p-6 w-full max-w-md max-h-full bg-white rounded-xl shadow-hero-xl z-30 overflow-y-scroll scrolling-touch"
				>
					{/* X: */}
					<div className="p-6 absolute right-0 top-0">
						<div className="p-2 text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 rounded-full cursor-pointer" onClick={e => setReadme(false)}>
							<Feather.X className="p-px w-5 h-5 stroke-500" />
						</div>
					</div>
					<EditorReadme />
				</div>
			</div>
			{props.children}
		</div>
	)
}

// useEscape(toolbar[0].readme, on => {
// 	toolbar[1].setProperty("readme", on)
// })

const Demo = props => (
	// <WithReadmeSurface readme={toolbar[0].readme} setReadme={on => toolbar[1].setProperty("readme", on)}>
	<div className="flex flex-row justify-center">
		<div className="w-full max-w-4xl bg-white">
			<EditorDemo />
		</div>
	</div>
	// </WithReadmeSurface>
)

export default Demo
