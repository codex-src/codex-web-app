import AppContainer from "components/AppContainer"
import ExternalLink from "lib/ExternalLink"
import React from "react"

import {
	GitHubLogo,
	TwitterLogo,
} from "svgs"

const Footer = () => (
	<div className="py-4 border-t-4 border-gray-100">
		<AppContainer>
			<div className="flex flex-col sm:flex-row justify-between items-center">

				{/* Copyright */}
				<div className="order-2 sm:order-1">
					<p className="flex flex-row items-center text-gray-500" style={{ height: "3.5rem" /* h-14 */ }}>
						© 2020 Codex, Inc. All rights reserved.
					</p>
				</div>

				{/* Icons */}
				<div className="order-1 sm:order-2">
					<div className="flex flex-row items-center">

						{/* GitHub */}
						<ExternalLink
							href="https://github.com/codex-src"
							className="p-4 pr-2 text-gray-500 hover:text-github-gray transition ease-out duration-150"
						>
							<GitHubLogo className="w-6 h-6" />
						</ExternalLink>

						{/* Twitter */}
						<ExternalLink
							href="https://twitter.com/username_ZAYDEK"
							className="p-4 pl-2 text-gray-500 hover:text-twitter-blue transition ease-out duration-150"
						>
							<TwitterLogo className="w-6 h-6" />
						</ExternalLink>

					</div>
				</div>

			</div>
		</AppContainer>
	</div>
)

export default Footer
