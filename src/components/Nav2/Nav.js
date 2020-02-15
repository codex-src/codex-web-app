import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "assets/codex.svg"

const Nav = props => (
	<nav className="px-6 absolute inset-x-0 top-0 flex justify-center h-20 bg-white z-30">
		<div className="flex justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<Link to="/" className="flex items-center h-full hover:text-brand transition duration-75 ease-in-out">
				<CodexLogo style={{ width: "5.625rem", height: "3.75rem" }} />
			</Link>

			{/* RHS: */}
			<div className="flex items-center h-full">
				<Link
					to="#features"
					className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out"
					children="Features"
				/>
				<Link
					to="#pricing"
					className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out"
					children="Pricing"
				/>
				<Link
					to="/sign-in"
					className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out"
					children="Login"
				/>
				{/* CTA: */}
				<Link
					to="/demo"
					className="-mr-4 px-4 flex items-center h-full"
				>
					<div className="px-3 py-2 text-brand border border-brand rounded-sm">
						<p className="font-medium">
							Try the editor alpha
						</p>
					</div>
				</Link>
			</div>
		</div>
	</nav>
)

export default Nav
