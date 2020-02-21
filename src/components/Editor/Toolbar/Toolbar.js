import * as Feather from "react-feather"
import Button from "./Button"
import EnumActionTypes from "../EnumActionTypes"
import EnumStylesheets from "../EnumStylesheets"
import Link from "utils/RouterLink"
import React from "react"
import WithTooltip from "./WithTooltip"
import { ReactComponent as GitHubLogo } from "./github-logo.svg"

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
	<WithTooltip tooltip={tooltip}>
		<Button {...props} />
	</WithTooltip>
)

const Toolbar = ({ state, dispatch, ...props }) => (
	<div className="m-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="-mx-2 p-1 flex flex-row justify-between bg-white rounded-lg shadow-hero-lg pointer-events-auto">
			{/* Undo and redo: */}
			<div className="mr-2 flex flex-row">
				<ButtonIcon
					tooltip="Undo (⌘Z)"
					svg={Feather.ArrowLeft}
					disabled={!state.history.index}
					active={state.actionType === EnumActionTypes.UNDO}
					onClick={dispatch.undo}
				/>
				<ButtonIcon
					tooltip="Redo (⌘⇧Z or ⌘Y)"
					svg={Feather.ArrowRight}
					disabled={state.history.index + 1 === state.history.stack.length}
					active={state.actionType === EnumActionTypes.REDO}
					onClick={dispatch.redo}
				/>
			</div>
			{/* Stylesheets: */}
			<div className="mx-2 flex flex-row">
				<ButtonIcon
					tooltip="Type stylesheet (⌘⇧1)"
					svg={Feather.Image}
					active={state.prefs.stylesheet === EnumStylesheets.TYPE}
					onClick={e => dispatch.toggleStylesheet(EnumStylesheets.TYPE)}
				/>
				<ButtonIcon
					tooltip="Mono stylesheet (⌘⇧2)"
					svg={Feather.Image}
					active={state.prefs.stylesheet === EnumStylesheets.MONO}
					onClick={e => dispatch.toggleStylesheet(EnumStylesheets.MONO)}
				/>
				<ButtonIcon
					tooltip="Text background (⌘⇧P)"
					svg={Feather.Edit3}
					active={state.prefs.textBackground}
					onClick={dispatch.toggleTextBackground}
				/>
				<ButtonIcon
					tooltip="Preview mode (⌘P)"
					svg={Feather.Monitor}
					active={state.prefs.previewMode}
					onClick={dispatch.togglePreviewMode}
				/>
			</div>
			{/* Readme: */}
			<div className="ml-2 flex flex-row">
				<ButtonIcon
					tooltip="Open Readme (Esc)"
					svg={Feather.HelpCircle}
					active={state.prefs.readme}
					onClick={dispatch.toggleReadme}
				/>
				<Link
					to="https://github.com/codex-src/codex-app"
					target="_blank"
					children={
						<ButtonIcon
							tooltip="Open GitHub"
							svg={GitHubLogo}
						/>
					}
				/>
			</div>
		</div>
	</div>
)

export default Toolbar
