import * as Meta from "components/Meta"
import * as routes from "routes"
import AppContainer from "components/AppContainer"
import CodexLogo from "components/CodexLogo"
import ExternalLink from "lib/ExternalLink"
import React from "react"
import trimSpaces from "lib/trimSpaces"
import useClickAway from "components/hooks/useClickAway"
import useEscape from "components/hooks/useEscape"
import { Link } from "react-router-dom"

const MetaDropDownItem = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`${children.props.className}
			px-4 py-2 flex flex-row items-center font-medium text-sm leading-5 text-gray-700 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
				${className}`),
	})
)

const DropDown = () => {
	const ref = React.useRef()

	const [open, setOpen] = React.useState(false)

	useClickAway(ref, () => {
		setOpen(false)
	})

	useEscape(ref, () => {
		setOpen(false)
	})

	return (
		<div className="relative block lg:hidden">

			<Meta.Transition>
				<button
					className="p-2 flex flex-row justify-center items-center text-gray-400 hover:text-gray-500 focus:text-gray-500 hover:bg-gray-100 focus:bg-gray-100 rounded-md focus:outline-none"
					onClick={() => setOpen(!open)}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path d={!open ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
					</svg>
				</button>
			</Meta.Transition>

			{open && (
				<div ref={ref} className="mt-2 absolute right-0 w-56 rounded-md shadow-lg">
					<div className="bg-white rounded-md shadow-xs">
						<div className="py-1">
							<MetaDropDownItem>
								<Link
									to={routes.DEMO}
									onClick={() => setOpen(false)}
								>
									Try the Demo!
								</Link>
							</MetaDropDownItem>
							<MetaDropDownItem>
								<Link
									to={routes.PRICING}
									onClick={() => setOpen(false)}
								>
									Pricing
								</Link>
							</MetaDropDownItem>
						</div>
						<div className="border-t border-gray-100" />
						<div className="py-1">
							<MetaDropDownItem>
								<ExternalLink href="https://github.com/codex-src">
									Open Source{" "}
									<svg
										className="ml-2 w-4 h-4 opacity-50 transform scale-110"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
									>
										<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</ExternalLink>
							</MetaDropDownItem>
						</div>
						<div className="border-t border-gray-100" />
						<div className="py-1">
							<MetaDropDownItem>
								<Link
									to={routes.SIGN_IN}
									onClick={() => setOpen(false)}
								>
									Sign In
								</Link>
							</MetaDropDownItem>
							<MetaDropDownItem>
								<Link
									to={routes.SIGN_UP}
									onClick={() => setOpen(false)}
								>
									Sign Up for Codex
								</Link>
							</MetaDropDownItem>
						</div>
					</div>
				</div>
			)}

		</div>
	)
}

const MetaNavItem = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`${children.props.className}
			px-3 flex flex-row items-center
				${className}`),
	})
)

const Nav = () => (
	<AppContainer>
		<nav className="flex flex-row justify-between items-center h-20">

			{/* LHS */}
			<div className="-mx-3 flex flex-row h-full">
				<MetaNavItem>
					<Link style={{ fontSize: "50%" }} to={routes.HOME}>
						<CodexLogo />
					</Link>
				</MetaNavItem>
			</div>

			{/* RHS */}
			<div className="-mx-3 hidden lg:flex lg:flex-row h-full">
				<MetaNavItem>
					<Link to={routes.DEMO}>
						Try the Demo!
					</Link>
				</MetaNavItem>
				<MetaNavItem>
					<Link to={routes.PRICING}>
						Pricing
					</Link>
				</MetaNavItem>
				<MetaNavItem>
					<ExternalLink href="https://github.com/codex-src">
						Open Source{" "}
						<svg
							className="ml-2 w-4 h-4 opacity-50 transform scale-110"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
					</ExternalLink>
				</MetaNavItem>
				<MetaNavItem>
					<Link to={routes.SIGN_IN}>
						Sign In
					</Link>
				</MetaNavItem>
				<div className="px-3 flex flex-row items-center">
					<div className="rounded-md shadow-hero">
						<Meta.Focusable>
							<Link className="px-4 flex flex-row items-center h-12 font-medium text-md-blue-a400 rounded-md" to={routes.SIGN_UP}>
								Sign Up for Codex
							</Link>
						</Meta.Focusable>
					</div>
				</div>
			</div>

			<DropDown />

		</nav>
	</AppContainer>
)

export default Nav
