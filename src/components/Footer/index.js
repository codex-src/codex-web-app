import AppContainer from "components/AppContainer"
import React from "react"
import paths from "paths"
import { Link } from "react-router-dom"
import { LinkText } from "components/Styled"

import {
	GitHubLogo,
	TwitterLogo,
} from "svgs"

const Footer = () => (
	// NOTE: border-gray-* matches <RaisedSurfaceSeparator>
	<div className="py-8 flex flex-col items-center border-t border-gray-300 dark:border-gray-700">
		<AppContainer>
			<div className="flex flex-col items-center">

				{/* Icons */}
				<div className="flex flex-row items-center">
					<Link to={paths.home} className="p-4 text-gray-500 hover:text-md-blue-a400 dark:hover:text-md-blue-a200 transition ease-out duration-150">
						<GitHubLogo
							className="w-6 h-6"
						/>
					</Link>
					<Link to={paths.home} className="p-4 text-gray-500 hover:text-md-blue-a400 dark:hover:text-md-blue-a200 transition ease-out duration-150">
						<TwitterLogo
							className="w-6 h-6"
						/>
					</Link>
				</div>

				{/* Copyright */}
				<div className="h-4" />
				<p className="-text-px tracking-px text-gray-500">
					© 2020 Codex, Inc. All rights reserved.
				</p>

			</div>
		</AppContainer>
	</div>
)

export default Footer
