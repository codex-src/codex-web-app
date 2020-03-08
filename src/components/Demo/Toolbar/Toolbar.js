// import * as constants from "__constants"
// import Link from "utils/RouterLink"
// import { ReactComponent as GitHubLogo } from "./github.svg"
import * as Feather from "react-feather"
import Button from "./Button"
import React from "react"
import Tooltip from "./Tooltip"

// {/* Cut, copy, and paste: */}
// <div className="mx-2 hidden md:flex md:flex-row">
// 	<ButtonIcon
// 		tooltip="Cut selection (⌘X)"
// 		svg={Feather.Scissors}
// 		active={state.actionType === EnumActionTypes.CUT}
// 		onClick={dispatch.cut}
// 	/>
// 	<ButtonIcon
// 		tooltip="Copy selection (⌘C)"
// 		svg={Feather.Copy}
// 		active={state.actionType === EnumActionTypes.COPY}
// 		onClick={dispatch.copy}
// 	/>
// 	<ButtonIcon
// 		tooltip="Paste clipboard (⌘V)"
// 		svg={Feather.Clipboard}
// 		active={state.actionType === EnumActionTypes.PASTE}
// 		onClick={dispatch.paste}
// 	/>
// </div>

const ButtonIcon = ({ tooltip, ...props }) => (
	<Tooltip tooltip={tooltip}>
		<Button {...props} />
	</Tooltip>
)

const Toolbar = ({ state, dispatch, ...props }) => (
	<div className="m-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none" data-e2e="editor-toolbar">
		<div className="-mx-2 p-1 flex flex-row justify-between bg-white rounded-lg shadow-hero-lg pointer-events-auto">
			{/* Undo and redo: */}
			<div className="mr-2 flex flex-row">
				<ButtonIcon
					tooltip="Undo (⌘Z)"
					svg={Feather.ArrowLeft}
					// NOTE: Ignore state.prefs.readOnly
					disabled={state.prefs.previewMode || !state.history.index}
					active={state.actionType === "UNDO"}
					onClick={dispatch.undo}
					data-e2e="editor-toolbar-btn-1"
				/>
				<ButtonIcon
					tooltip="Redo (⌘⇧Z or ⌘Y)"
					svg={Feather.ArrowRight}
					// NOTE: Ignore state.prefs.readOnly
					disabled={state.prefs.previewMode || state.history.index + 1 === state.history.stack.length}
					active={state.actionType === "REDO"}
					onClick={dispatch.redo}
					data-e2e="editor-toolbar-btn-2"
				/>
			</div>
			{/* Stylesheets: */}
			<div className="mx-2 flex flex-row">
				<ButtonIcon
					tooltip="Type stylesheet (⌘⇧1)"
					svg={Feather.Image}
					active={state.prefs.stylesheet === "TYPE"}
					onClick={e => dispatch.toggleStylesheet("TYPE")}
					data-e2e="editor-toolbar-btn-3"
				/>
				<ButtonIcon
					tooltip="Mono stylesheet (⌘⇧2)"
					svg={Feather.Image}
					active={state.prefs.stylesheet === "MONO"}
					onClick={e => dispatch.toggleStylesheet("MONO")}
					data-e2e="editor-toolbar-btn-4"
				/>
				<ButtonIcon
					tooltip="Text background (⌘⇧P)"
					svg={Feather.Edit3}
					active={state.prefs.textBackground}
					onClick={dispatch.toggleTextBackground}
					data-e2e="editor-toolbar-btn-5"
				/>
				<ButtonIcon
					tooltip="Preview mode (⌘P)"
					svg={Feather.Monitor}
					active={state.prefs.previewMode}
					onClick={dispatch.togglePreviewMode}
					data-e2e="editor-toolbar-btn-6"
				/>
			</div>
			{/* Readme: */}
			<div className="ml-2 flex flex-row">
				<ButtonIcon
					tooltip="Open readme (Esc)"
					svg={Feather.HelpCircle}
					active={state.prefs.readme}
					onClick={dispatch.toggleReadme}
					data-e2e="editor-toolbar-btn-7"
				/>
				{/* <Link */}
				{/* 	to={constants.URL_REPO} */}
				{/* 	target="_blank" */}
				{/* 	data-e2e="editor-toolbar-btn-8" */}
				{/* 	children={ */}
				{/* 		<ButtonIcon */}
				{/* 			tooltip="Open GitHub" */}
				{/* 			svg={GitHubLogo} */}
				{/* 		/> */}
				{/* 	} */}
				{/* /> */}
			</div>
		</div>
	</div>
)

export default Toolbar
