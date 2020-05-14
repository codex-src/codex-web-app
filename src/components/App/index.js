import Button from "lib/Button"
import React from "react"
import { CodexLogoSm } from "components/CodexLogo"

import {
	RaisedSurface,
	RaisedSurfaceSeparator as Separator,
	Surface,
} from "components/Styled/Surface"

import {
	LinkText,
	Text,
} from "components/Styled/Text"

import {
	BrowserRouter,
	Link,
} from "react-router-dom"

// document.body.classList.toggle("debug-css")

const App = () => (
	<BrowserRouter>
		<div className="px-6 flex flex-row justify-center">
			<div className="w-full max-w-5xl">

				{/* Nav */}
				<div className="flex flex-row justify-between items-center h-20">

					{/* LHS */}
					<div className="flex flex-row h-full">
						<Link to="/" className="flex flex-row" style={{ fontSize: "50%" }}>
							<CodexLogoSm />
						</Link>
					</div>

					{/* RHS */}
					<div className="hidden lg:flex lg:flex-row h-full">
						<LinkText host={Button} className="px-3 !-text-px tracking-px transition ease-out duration-150">
							Features
						</LinkText>
						<LinkText host={Button} className="px-3 !-text-px tracking-px transition ease-out duration-150">
							Try the Demo!
						</LinkText>
						<LinkText host={Button} className="px-3 !-text-px tracking-px transition ease-out duration-150">
							Blog
						</LinkText>
						<LinkText host={Button} className="px-3 !-text-px tracking-px transition ease-out duration-150">
							Open Source
						</LinkText>
						<div className="w-3" />
						<div className="flex flex-row items-center">
							<Surface host="button" className="rounded-lg focus:outline-none focus:shadow-outline transition ease-out duration-150">
								<Text className="px-4 py-3 font-medium !-text-px tracking-px text-md-blue-a400">
									Open your Codex
								</Text>
							</Surface>
						</div>
					</div>

					{/* RHS -- drop down */}
					<div className="flex flex-row lg:hidden h-full">

						{/* Container */}
						<div className="relative flex flex-row items-center">

							{/* Menu */}
							<Text
								host="svg"
								className="w-8 h-8"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{/* <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /> */}
								<path d="M4 6h16M4 12h16M4 18h16" />
							</Text>

							{/* Drop down */}
							<div className="mt-16 absolute top-0 right-0">
								<RaisedSurface className="py-2 w-48 rounded-lg">
									<div className="-mx-px px-4 py-1 -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a400 dark:hover:bg-md-blue-a200">
										Features
									</div>
									<div className="-mx-px px-4 py-1 -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a400 dark:hover:bg-md-blue-a200">
										Try the Demo!
									</div>
									<Separator className="my-2" />
									<div className="-mx-px px-4 py-1 -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a400 dark:hover:bg-md-blue-a200">
										Blog
									</div>
									<div className="-mx-px px-4 py-1 -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a400 dark:hover:bg-md-blue-a200">
										Open Source
									</div>
									<Separator className="my-2" />
									<div className="-mx-px px-4 py-1 -text-px tracking-px text-black hover:text-white dark:text-white hover:bg-md-blue-a400 dark:hover:bg-md-blue-a200">
										Open your Codex
									</div>
								</RaisedSurface>
							</div>

						</div>
					</div>

				</div>

			</div>
		</div>
	</BrowserRouter>
)

export default App
