import * as Feather from "react-feather"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import RouterLink from "utils/RouterLink"
import { ReactComponent as CodexLogo } from "./codex.svg"

const Link = ({ className, ...props }) => (
	<RouterLink className={`${className || ""} select-none`} {...props} />
)

const NavLink = ({ text, ...props }) => (
	<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400 trans-75" {...props}>
		<p className="font-500">
			{text}
		</p>
	</Link>
)

const Nav = props => (
	<nav className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 z-30">
		<div className="flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center hover:text-md-blue-a400 trans-75" to="/" data-e2e="nav-home">
					<CodexLogo style={{ width: 60 * 1.5, height: 60 }} />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row">
				<NavLink
					to="TODO"
					text="What is Codex?"
				/>
				<NavLink
					to="TODO"
					text="Features"
				/>
				<NavLink
					to="TODO"
					text="Demo"
				/>
				<NavLink
					to="TODO"
					text="Pricing"
				/>
				<div className="mx-3 flex flex-row items-center">
					<Link className="p-3 flex flex-row items-center text-md-blue-a400 hover:bg-gray-100 active:bg-gray-200 rounded-md shadow-hero hover:shadow-hero-md trans-150">
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
