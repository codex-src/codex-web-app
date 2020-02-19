import * as Feather from "react-feather"
import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as GitHubLogo } from "./svg/github-logo.svg"

import "./Tooltip.css"

const Tooltip = props => (
	<div className="m-2 px-2 py-1 bg-black rounded-sm opacity-90 select-none">
		<p className="whitespace-pre font-700 text-xs text-gray-100">
			{props.children}
		</p>
	</div>
)

function WithTooltip(props) {
	const [show, setShow] = React.useState(0)

	return (
		<div
			className="relative"
			onPointerEnter={e => setShow(1)}
			onPointerLeave={e => setShow(0)}
		>
			{(props.tooltip && show === 1) && (
				<div className={`tooltip-${props.dir || "t"}`}>
					<Tooltip>
						{props.tooltip}
					</Tooltip>
				</div>
			)}
			{props.children}
		</div>
	)
}

// TODO: Disabled
const Button = ({ svg: SVG, ...props }) => (
	<WithTooltip dir="t" tooltip={props.tooltip}>
		{!props.on ? (
			// Off:
			<div className="p-2 text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 rounded-lg cursor-pointer" onClick={props.onClick}>
				<SVG className="p-px w-5 h-5 stroke-500" />
			</div>
		) : (
			// On:
			<div className="p-2 text-blue hover:bg-blue-100 rounded-lg cursor-pointer" onClick={props.onClick}>
				<SVG className="p-px w-5 h-5 stroke-500" />
			</div>
		)}
	</WithTooltip>
)

const Toolbar = ({ editor, state, dispatch, ...props }) => (
	<div className="m-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="p-1 flex flex-row justify-between bg-white rounded-lg shadow-hero-lg pointer-events-auto">
			{/* Undo and redo: */}
			<div className="flex flex-row">
				<Button
					tooltip="Undo (⌘Z)"
					svg={Feather.ArrowLeft}
					on={false}
					onClick={e => editor[1].undo()}
				/>
				<Button
					tooltip="Redo (⌘Y)"
					svg={Feather.ArrowRight}
					on={false}
					onClick={e => editor[1].redo()}
				/>
			</div>
			{/* Cut, copy, and paste: */}
			<div className="m-4" />
			<div className="flex flex-row">
				<Button
					tooltip="Cut selection (⌘X)"
					svg={Feather.Scissors}
					// on={false}
					// onClick={e => editor[1].cut()}
				/>
				<Button
					tooltip="Copy selection (⌘C)"
					svg={Feather.Copy}
					// on={false}
					// onClick={e => editor[1].copy()}
				/>
				<Button
					tooltip="Paste clipboard (⌘V)"
					svg={Feather.Clipboard}
					// on={false}
					// onClick={e => editor[1].paste()}
				/>
			</div>
			{/* Stylesheets, etc.: */}
			<div className="m-4" />
			<div className="flex flex-row">
				<Button
					tooltip="Type stylesheet (⌘⇧1)"
					svg={Feather.Image}
					on={!editor[0].prefers.monospace}
					onClick={e => editor[1].toggleMonospace(false)}
				/>
				<Button
					tooltip="Code stylesheet (⌘⇧2)"
					svg={Feather.Image}
					on={editor[0].prefers.monospace}
					onClick={e => editor[1].toggleMonospace(true)}
				/>
				<Button
					tooltip="Inline background (⌘⇧P)"
					svg={Feather.Edit3}
					on={!editor[0].prefers.previewMode && editor[0].prefers.inlineBackground}
					onClick={e => editor[1].toggleInlineBackground()}
				/>
				<Button
					tooltip="Preview mode (⌘P)"
					svg={Feather.Monitor}
					on={editor[0].prefers.previewMode}
					onClick={e => editor[1].togglePreviewMode()}
				/>
			</div>
			{/* More: */}
			<div className="m-4" />
			<div className="flex flex-row">
				<Button
					tooltip="Open Readme (Esc)"
					svg={Feather.HelpCircle}
					on={state.readme}
					onClick={() => dispatch.toggleProperty("readme")}
				/>
				<Link
					to="https://github.com/codex-src/codex-app"
					target="_blank"
					children={
						<Button
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
