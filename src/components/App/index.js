import React from "react"
import { CodexLogoSm } from "components/CodexLogo"
import { Surface } from "components/Styled/Surface"

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
					<div className="flex flex-row h-full">
						<LinkText host="button" className="px-3 tracking-px transition ease-out duration-150">
							Features
						</LinkText>
						<LinkText host="button" className="px-3 tracking-px transition ease-out duration-150">
							Demo
						</LinkText>
						<LinkText host="button" className="px-3 tracking-px transition ease-out duration-150">
							Changelog
						</LinkText>
						<LinkText host="button" className="px-3 tracking-px transition ease-out duration-150">
							Open Source
						</LinkText>
						<div className="w-3" />
						<div className="flex flex-row items-center">
							<Surface host="button" className="rounded-lg focus:outline-none focus:shadow-outline transition ease-out duration-150">
								<Text className="px-4 py-3 font-medium tracking-px text-md-blue-a400">
									Open your Codex
								</Text>
							</Surface>
						</div>
					</div>

				</div>

			</div>
		</div>
	</BrowserRouter>
)

export default App
