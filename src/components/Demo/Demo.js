// import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import ReadmeEditor from "./ReadmeEditor"
import UIBar from "./UIBar"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")

function DemoEditor(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, /* statusBar: true */ })

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	// FIXME: Remove shortcuts
	return <Editor.Editor state={state} dispatch={dispatch} />
}

// const CloseButton = props => (
// 	<div className="flex flex-row justify-center items-center w-10 h-10 bg-white hover:bg-gray-100 rounded-full cursor-pointer transition duration-200 ease-in-out">
// 		<Feather.X className="stroke-500 w-5 h-5 text-gray-800" />
// 	</div>
// )

// {/* <div className="p-4 absolute top-0 right-0"> */}
// {/* 	<CloseButton /> */}
// {/* </div> */}

function Demo(props) {
	// TODO: Refactor to hook
	const [openReadme, setOpenReadme] = React.useState(false)

	const didMount = React.useRef()
	React.useEffect(() => {
		if (!didMount.current) {
			didMount.current = true
			return
		}
		/* eslint-disable no-multi-spaces */
		if (openReadme) {
			const { scrollY } = window // Takes precedence
			document.body.style.position = "fixed"
			document.body.style.left     = 0
			document.body.style.right    = 0
			document.body.style.top      = `${-scrollY}px`
		} else {
			const { top } = document.body.style
			document.body.style.position = ""
			document.body.style.left     = ""
			document.body.style.right    = ""
			document.body.style.top      = ""
			window.scrollTo(0, -top.slice(0, -2))
		}
		/* eslint-enable no-multi-spaces */
	}, [openReadme])

	React.useEffect(() => {
		const h = e => {
			if (e.keyCode !== 27) { // 27: Escape
				// No-op
				return
			}
			setOpenReadme(!openReadme)
		}
		document.addEventListener("keydown", h)
		return () => {
			document.removeEventListener("keydown", h)
		}
	}, [openReadme])

	return (
		<div>
			{openReadme && (
				<React.Fragment>
					<div
						className="p-6 fixed inset-0 z-40 flex flex-row justify-center items-center pointer-events-none"
						style={{ transform: "scale(0.95)" }}
					>
						<div className="relative p-6 max-w-2xl max-h-full bg-white rounded-md shadow-md overflow-y-scroll scrolling-touch pointer-events-auto">
							<ReadmeEditor />
						</div>
					</div>
					<div
						className="fixed inset-0 z-30"
						style={{ background: "hsla(0, 0%, 0%, 0.1)" }}
						onClick={e => setOpenReadme(false)}
					/>
				</React.Fragment>
			)}
			<div className="md:py-24 flex justify-center !bg-md-gray-50">
				<div className="p-6 max-w-3xl bg-white">
					<DemoEditor />
				</div>
			</div>
			<UIBar handleOpenReadme={e => setOpenReadme(true)} />
		</div>
	)
}

export default Demo
