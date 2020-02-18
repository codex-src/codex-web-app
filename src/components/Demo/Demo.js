import * as Feather from "react-feather"
import Editor from "components/Editor"
import raw from "raw.macro"
import React from "react"
import ReadmeEditor from "./ReadmeEditor"
import UIBar from "./UIBar"

const LOCAL_STORAGE_KEY = "codex-app"

const demo = localStorage.getItem(LOCAL_STORAGE_KEY) || raw("./markdown/demo.md")

function DemoEditor(props) {
	const [state, dispatch] = Editor.useEditor(demo, { shortcuts: true, statusBar: true })

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(LOCAL_STORAGE_KEY, state.data)
		}, [state]),
		[state.historyIndex],
	)

	// FIXME: Shortcuts
	return <Editor.Editor state={state} dispatch={dispatch} />
}

const Demo = props => (
	<div>
		<div className="fixed right-0 inset-y-0 inset-y-0 z-40 pointer-events-none">
			<div className="p-6 max-w-md h-full bg-white shadow-hero-sm overflow-y-scroll scrolling-touch pointer-events-auto">
				<ReadmeEditor />
			</div>
		</div>
		<div className="py-32 flex justify-center !bg-md-gray-50">
			<div className="p-6 !lg:p-12 bg-white !shadow-xs">
				<div className="bg-white" style={{ maxWidth: 834 }}>
					<DemoEditor />
				</div>
			</div>
		</div>
		<UIBar />
	</div>
)

export default Demo
