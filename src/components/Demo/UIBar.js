import * as Feather from "react-feather"
import React from "react"

import { ReactComponent as GitHubLogo } from "./svg/github-logo.svg"

// {/* <div className="my-1"> */}
// {/* 	<div className="w-px h-full bg-gray-300" /> */}
// {/* </div> */}

const UIIcon = ({ icon: Icon, ...props }) => (
	<div className="flex flex-row justify-center items-center w-10 h-10 hover:bg-gray-200 rounded-full cursor-pointer">
		<Icon className="stroke-500 w-5 h-5 text-gray-800" />
	</div>
)

const UIBar = props => (
	<div className="px-6 py-4 fixed inset-x-0 bottom-0 flex flex-row justify-center z-20 pointer-events-none">
		<div className="px-2 py-1 flex flex-row justify-between bg-gray-100 rounded-md shadow-hero-md pointer-events-auto">
			<div className="mr-4 flex flex-row">
				<UIIcon
					icon={Feather.ArrowLeft}
					// TODO: onClick={...}
				/>
				<UIIcon
					icon={Feather.ArrowRight}
					// TODO: onClick={...}
				/>
			</div>
			<div className="mx-4 flex flex-row">
				<UIIcon
					icon={Feather.Scissors}
					// TODO: onClick={...}
				/>
				<UIIcon
					icon={Feather.Copy}
					// TODO: onClick={...}
				/>
				<UIIcon
					icon={Feather.Clipboard}
					// TODO: onClick={...}
				/>
			</div>
			<div className="mx-4 flex flex-row">
				<UIIcon
					icon={Feather.Image}
					// TODO: onClick={...}
				/>
				<UIIcon
					icon={Feather.Eye}
					// TODO: onClick={...}
				/>
			</div>
			<div className="ml-4 flex flex-row">
				<UIIcon
					icon={Feather.Info}
					// TODO: onClick={...}
				/>
				<UIIcon
					icon={GitHubLogo}
					// TODO: onClick={...}
				/>
			</div>
		</div>
	</div>
)

export default UIBar
