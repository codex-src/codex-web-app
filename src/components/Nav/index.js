import Button from "lib/Button"
import ExternalLink from "lib/ExternalLink"
import React from "react"
import paths from "paths"
import { WideAppContainer } from "components/AppContainers"
import { CodexLogoSm } from "components/CodexLogo"
import { Link } from "react-router-dom"

const Nav = () => {
	const dropDownRef = React.useRef()
	const [showDropDown, setShowDropDown] = React.useState(false)

	// useClickAway
	React.useEffect(() => {
		if (!showDropDown) {
			// No-op
			return
		}
		const handler = e => {
 			if (!dropDownRef.current) {
				// No-op
				return
			}
			const ok = (
				e.target === dropDownRef.current ||
				dropDownRef.current.contains(e.target)
			)
			setShowDropDown(ok)
		}
		document.addEventListener("click", handler)
		return () => {
			document.removeEventListener("click", handler)
		}
	}, [showDropDown])

	// useEscape
	React.useEffect(() => {
		if (!showDropDown) {
			// No-op
			return
		}
		const handler = e => {
 			if (!dropDownRef.current) {
				// No-op
				return
			}
			setShowDropDown(e.keyCode !== 27) // Escape
		}
		document.addEventListener("keydown", handler)
		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [showDropDown])

	return (
		<WideAppContainer>
			<div className="flex flex-row justify-between items-center h-20">

				{/* LHS */}
				<div className="flex flex-row h-full">
					<Link to={paths.home} className="flex flex-row" style={{ fontSize: "50%" }}>
						<CodexLogoSm />
					</Link>
				</div>

				{/* RHS */}
				<div className="hidden lg:flex lg:flex-row h-full">
					<Link
						to={paths.demo}
						className="px-3 flex flex-row items-center tracking-px hover:text-md-blue-a400 transition ease-out duration-150"
					>
						Try the Demo!
					</Link>
					<Link
						to={paths.pricing}
						className="px-3 flex flex-row items-center tracking-px hover:text-md-blue-a400 transition ease-out duration-150"
					>
						Pricing and FAQ
					</Link>
					<Link
						to={paths.blog}
						className="px-3 flex flex-row items-center tracking-px hover:text-md-blue-a400 transition ease-out duration-150"
					>
						Blog
					</Link>
					<ExternalLink
						href="https://github.com/codex-src"
						className="px-3 flex flex-row items-center tracking-px hover:text-md-blue-a400 transition ease-out duration-150"
					>
						Open Source
						<svg
							className="ml-1 w-5 h-5 opacity-50 transform scale-90"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
					</ExternalLink>
					<div className="w-3" />
					<div className="flex flex-row items-center">
						<Link to={paths.continue} className="bg-white rounded-lg focus:outline-none shadow-hero focus:shadow-outline transition ease-out duration-150">
							<p className="px-4 py-3 !-text-px tracking-px text-md-blue-a400">
								Open your Codex
							</p>
						</Link>
					</div>
				</div>

				{/* RHS -- drop down */}
				<div className="flex flex-row lg:hidden h-full">

					{/* Container */}
					<div className="relative flex flex-row">

						{/* Menu */}
						<Button className="px-4" onClick={() => setShowDropDown(true)}>
							<svg
								className="w-8 h-8 transform"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</Button>

						{/* Drop down */}
						{showDropDown && (
							<div ref={dropDownRef} className="mt-16 absolute top-0 right-0">
								<div className="py-2 w-48 bg-white rounded-lg shadow-hero-lg">
									{/* NOTE: Use bg-md-blue-a200 exclusively */}
									<Link
										to={paths.demo}
										className="-mx-px px-4 py-1 block -text-px tracking-px hover:text-white hover:bg-md-blue-a200"
										onClick={() => setShowDropDown(false)}
									>
										Try the Demo!
									</Link>
									<Link
										to={paths.pricing}
										className="-mx-px px-4 py-1 block -text-px tracking-px hover:text-white hover:bg-md-blue-a200"
										onClick={() => setShowDropDown(false)}
									>
										Pricing
									</Link>
									<hr className="my-2" />
									<Link
										to={paths.blog}
										className="-mx-px px-4 py-1 block -text-px tracking-px hover:text-white hover:bg-md-blue-a200"
										onClick={() => setShowDropDown(false)}
									>
										Blog
									</Link>
									<ExternalLink
										href="https://github.com/codex-src"
										className="-mx-px px-4 py-1 block -text-px tracking-px hover:text-white hover:bg-md-blue-a200"
										onClick={() => setShowDropDown(false)}
									>
										Open Source
									</ExternalLink>
									<hr className="my-2" />
									<Link
										to={paths.continue}
										className="-mx-px px-4 py-1 block -text-px tracking-px hover:text-white hover:bg-md-blue-a200"
										onClick={() => setShowDropDown(false)}
									>
										Open your Codex
									</Link>
								</div>
							</div>
						)}

					</div>
				</div>

			</div>
		</WideAppContainer>
	)
}

export default Nav
