import * as Feather from "react-feather"
import Button from "./Button"
import Link from "utils/RouterLink"
import React from "react"
import WithTooltip from "./WithTooltip"
import { ReactComponent as GitHubLogo } from "../svg/github-logo.svg"

const ButtonIcon = ({ tooltip, ...props }) => (
	<WithTooltip tooltip={tooltip}>
		<Button {...props} />
	</WithTooltip>
)

const Toolbar = ({ editor, state, dispatch, ...props }) => (
	<div className="m-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="p-1 flex flex-row justify-between bg-white rounded-lg shadow-hero-lg pointer-events-auto">
			{/* Undo and redo: */}
			<div className="flex flex-row">
				<ButtonIcon
					tooltip="Undo (⌘Z)"
					svg={Feather.ArrowLeft}
					disabled={!editor[0].historyIndex}
					on={false}
					onClick={e => editor[1].undo()}
				/>
				<ButtonIcon
					tooltip="Redo (⌘Y)"
					svg={Feather.ArrowRight}
					disabled={editor[0].historyIndex + 1 === editor[0].history.length}
					on={false}
					onClick={e => editor[1].redo()}
				/>
			</div>
			{/* Cut, copy, and paste: */}
			<div className="m-4 hidden md:block" />
			<div className="hidden md:flex md:flex-row">
				<ButtonIcon
					tooltip="Cut selection (⌘X)"
					svg={Feather.Scissors}
					// on={false}
					// onClick={e => editor[1].cut()}
				/>
				<ButtonIcon
					tooltip="Copy selection (⌘C)"
					svg={Feather.Copy}
					// on={false}
					// onClick={e => editor[1].copy()}
				/>
				<ButtonIcon
					tooltip="Paste clipboard (⌘V)"
					svg={Feather.Clipboard}
					// on={false}
					// onClick={e => editor[1].paste()}
				/>
			</div>
			{/* Stylesheets, etc.: */}
			<div className="m-4" />
			<div className="flex flex-row">
				<ButtonIcon
					tooltip="Type stylesheet (⌘⇧1)"
					svg={Feather.Image}
					on={!editor[0].prefers.monospace}
					onClick={e => editor[1].toggleMonospace(false)}
				/>
				<ButtonIcon
					tooltip="Code stylesheet (⌘⇧2)"
					svg={Feather.Image}
					on={editor[0].prefers.monospace}
					onClick={e => editor[1].toggleMonospace(true)}
				/>
				<ButtonIcon
					tooltip="Inline background (⌘⇧P)"
					svg={Feather.Edit3}
					on={!editor[0].prefers.previewMode && editor[0].prefers.inlineBackground}
					onClick={e => editor[1].toggleInlineBackground()}
				/>
				<ButtonIcon
					tooltip="Preview mode (⌘P)"
					svg={Feather.Monitor}
					on={editor[0].prefers.previewMode}
					onClick={e => editor[1].togglePreviewMode()}
				/>
			</div>
			{/* More: */}
			<div className="m-4" />
			<div className="flex flex-row">
				<ButtonIcon
					tooltip="Open Readme (Esc)"
					svg={Feather.HelpCircle}
					on={state.readme}
					onClick={() => dispatch.toggleProperty("readme")}
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
