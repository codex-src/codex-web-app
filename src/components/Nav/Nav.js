import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"

const NavLink = ({ text, ...props }) => (
	<Link className="px-3 flex flex-row items-center text-gray-700 hover:text-md-blue-a400 tx-75" {...props}>
		<p className="font-medium">
			{text}
		</p>
	</Link>
)

const Nav = props => (
	<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 z-30">
		<div className="flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center tx-75" to="/" data-e2e="nav-home">
					<div className="mr-3 text-md-blue-a400">
						<Feather.Layers className="w-6 h-6" />
					</div>
					<CodexLogo className="w-24 h-6" />
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
				{/* CTA: */}
				<div className="ml-6 mr-3 flex flex-row items-center">
					<Link className="px-4 py-3 flex flex-row items-center text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-gray-200 border border-md-blue-a400 rounded-md tx-150" to="/open">
						<p className="font-medium text-px">
							Open your Codex
						</p>
					</Link>
				</div>
			</div>

		</div>
	</div>
)

export default Nav
