import Button from "lib/Button"
import ExternalLink from "lib/ExternalLink"
import React from "react"
import paths from "paths"
import { CodexLogoSm } from "components/CodexLogo"
import { Link } from "react-router-dom"

import {
	LinkText,
	RaisedSurface,
	RaisedSurfaceSeparator as Separator,
	Surface,
	Text,
} from "components/Styled"

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
		<div className="flex flex-row justify-between items-center h-20">

			{/* LHS */}
			<div className="flex flex-row h-full">
				<Link to={paths.home} className="flex flex-row" style={{ fontSize: "50%" }}>
					<CodexLogoSm />
				</Link>
			</div>

			{/* RHS */}
			<div className="hidden md:flex md:flex-row h-full">
				<LinkText
					host={Link}
					to={paths.demo}
					className="px-3 flex flex-row items-center tracking-px transition ease-out duration-150"
				>
					Try the Demo!
				</LinkText>
				<LinkText
					host={Link}
					to={paths.pricing}
					className="px-3 flex flex-row items-center tracking-px transition ease-out duration-150"
				>
					Pricing
				</LinkText>
				<LinkText
					host={Link}
					to={paths.blog}
					className="px-3 flex flex-row items-center tracking-px transition ease-out duration-150"
				>
					Blog
				</LinkText>
				<LinkText
					host={ExternalLink}
					href="https://github.com/codex-src"
					className="px-3 flex flex-row items-center tracking-px transition ease-out duration-150"
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
				</LinkText>
				<div className="w-3" />
				<div className="flex flex-row items-center">
					<Surface host={Link} to={paths.continue} className="rounded-lg focus:outline-none focus:shadow-outline transition ease-out duration-150">
						<Text className="px-4 py-3 !-text-px tracking-px text-md-blue-a400">
							Open your Codex
						</Text>
					</Surface>
				</div>
			</div>

			{/* RHS -- drop down */}
			<div className="flex flex-row md:hidden h-full">

				{/* Container */}
				<div className="relative flex flex-row">

					{/* Menu */}
					<Button className="px-4" onClick={() => setShowDropDown(true)}>
						<Text
							host="svg"
							className="w-8 h-8 transform"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M4 6h16M4 12h16M4 18h16" />
						</Text>
					</Button>

					{/* Drop down */}
					{showDropDown && (
						<div ref={dropDownRef} className="mt-16 absolute top-0 right-0">
							<RaisedSurface className="py-2 w-48 rounded-lg">
								{/* NOTE: Use bg-md-blue-a200 exclusively
								for <RaisedSurface> */}
								<Link
									to={paths.demo}
									className="-mx-px px-4 py-1 block -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a200"
									onClick={() => setShowDropDown(false)}
								>
									Try the Demo!
								</Link>
								<Link
									to={paths.pricing}
									className="-mx-px px-4 py-1 block -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a200"
									onClick={() => setShowDropDown(false)}
								>
									Pricing
								</Link>
								<Separator className="my-2" />
								<Link
									to={paths.blog}
									className="-mx-px px-4 py-1 block -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a200"
									onClick={() => setShowDropDown(false)}
								>
									Blog
								</Link>
								<ExternalLink
									href="https://github.com/codex-src"
									className="-mx-px px-4 py-1 block -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a200"
									onClick={() => setShowDropDown(false)}
								>
									Open Source
								</ExternalLink>
								<Separator className="my-2" />
								<Link
									to={paths.continue}
									className="-mx-px px-4 py-1 block -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a200"
									onClick={() => setShowDropDown(false)}
								>
									Open your Codex
								</Link>
							</RaisedSurface>
						</div>
					)}

				</div>
			</div>

		</div>
	)
}

export default Nav
