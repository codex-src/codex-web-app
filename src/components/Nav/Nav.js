import * as Feather from "react-feather"
import CSSDebugger from "utils/CSSDebugger"
import RouterLink from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "./codex.svg"

const Link = ({ className, ...props }) => (
	<RouterLink className={`${className || ""} select-none`} {...props} />
)

const Nav = props => (
	<nav className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 z-30">
		<div className="flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center hover:text-md-blue-a400" to="/" data-e2e="nav-home">
					<CodexLogo style={{ width: 60 * 1.5, height: 60 }} />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400" to="TODO">
					<p className="font-500">
						What is Codex?
					</p>
				</Link>
				<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400" to="TODO">
					<p className="font-500">
						Features
					</p>
				</Link>
				<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400" to="TODO">
					<p className="font-500">
						Demo
					</p>
				</Link>
				<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400" to="TODO">
					<p className="font-500">
						Pricing
					</p>
				</Link>
				<div className="mx-3 flex flex-row items-center">
					<Link className="p-3 flex flex-row items-center text-md-blue-a400 hover:bg-gray-100 active:bg-gray-200 rounded-md shadow-hero">
						<Feather.FileText className="mr-3 stroke-500 w-4 h-4" />
						<p className="font-500">
							Open your Codex
						</p>
					</Link>
				</div>
			</div>

		</div>
		{/* <CSSDebugger /> */}
	</nav>
)

export default Nav
