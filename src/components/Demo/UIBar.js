import * as Feather from "react-feather"
import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as GitHubLogo } from "./svg/github-logo.svg"

import "./Tooltip.css"

const Tooltip = props => (
	<div className="m-2 px-2 py-1 bg-black rounded-sm opacity-90">
		<p className="whitespace-pre font-700 text-xs text-gray-100">
			{props.children}
		</p>
	</div>
)

function WithTooltip(props) {
	const [show, setShow] = React.useState(false)

	return (
		<div className="relative" onPointerEnter={e => setShow(true)} onPointerLeave={e => setShow(false)}>
			{(props.tooltip && show) && (
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

const Button = ({ svg: SVG, ...props }) => (
	<WithTooltip dir="t" tooltip={props.tooltip}>
		<div className="p-2 text-gray-800 fill-current hover:bg-gray-100 rounded-md transition duration-75 ease-in-out cursor-pointer" onClick={props.onClick}>
			<SVG className="w-5 h-5 stroke-500" />
		</div>
	</WithTooltip>
)

// !w-full !max-w-3xl
const UIBar = props => (
	<div className="m-2 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="p-1 flex flex-row justify-between bg-white hover:bg-white rounded-lg shadow-hero-lg pointer-events-auto">
			<div className="flex flex-row">
				<Button
					tooltip="Undo (⌘Z)"
					svg={Feather.ArrowLeft}
					// onClick={...}
				/>
				<Button
					tooltip="Redo (⌘Y)"
					svg={Feather.ArrowRight}
					// onClick={...}
				/>
			</div>
			<div className="mx-2" />
			<div className="flex flex-row">
				<Button
					tooltip="Cut selection (⌘X)"
					svg={Feather.Scissors}
					// onClick={...}
				/>
				<Button
					tooltip="Copy selection (⌘C)"
					svg={Feather.Copy}
					// onClick={...}
				/>
				<Button
					tooltip="Paste clipboard (⌘V)"
					svg={Feather.Clipboard}
					// onClick={...}
				/>
			</div>
			<div className="mx-2" />
			<div className="flex flex-row">
				<Button
					tooltip="Type stylesheet (⌘1)"
					svg={Feather.Type}
					// onClick={...}
				/>
				<Button
					tooltip="Code stylesheet (⌘2)"
					svg={Feather.Code}
					// onClick={...}
				/>
				<Button
					tooltip="Preview mode (⌘P)"
					svg={Feather.Eye}
					// onClick={...}
				/>
			</div>
			<div className="mx-2" />
			<div className="flex flex-row">
				<Button
					tooltip="Open Readme (Escape)"
					svg={Feather.HelpCircle}
					onClick={props.handleOpenReadme}
				/>
				<Link
					to="https://github.com/codex-src/codex-app"
					target="_blank"
					children={
						<Button
							// tooltip="Open GitHub"
							svg={GitHubLogo}
						/>
					}
				/>
			</div>
		</div>
	</div>
)

export default UIBar
