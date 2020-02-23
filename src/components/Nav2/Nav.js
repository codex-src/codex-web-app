import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "./codex.svg"

const Nav = props => (
	<nav className={`px-6 absolute inset-x-0 top-0 flex justify-center h-20 ${props.background || "bg-white"} z-30`}>
		<div className="flex justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<Link
				className="flex items-center h-full hover:text-brand transition duration-75 ease-in-out"
				to="/"
				children={<CodexLogo style={{ width: "5.625rem", height: "3.75rem" }} />}
				data-e2e="nav-home"
			/>

			{/* RHS: */}
			<div className="flex items-center h-full">
				{/* <Link */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	to="#features" */}
				{/* 	children="Features" */}
				{/* /> */}
				{/* <Link */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	to="#pricing" */}
				{/* 	children="Pricing" */}
				{/* /> */}
				{/* <Link */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	to="/sign-in" */}
				{/* 	children="Login" */}
				{/* /> */}
				{/* CTA: */}
				<Link
					className="-mr-4 px-4 flex items-center h-full"
					to="/demo"
					data-e2e="nav-demo"
				>
					<div className="px-3 py-2 text-brand border border-brand rounded-sm">
						<p className="font-500">
							Try the editor alpha
						</p>
					</div>
				</Link>
			</div>
		</div>
	</nav>
)

export default Nav
