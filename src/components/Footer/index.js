import * as Meta from "components/Meta"
import * as SVG from "svgs"
import AppContainer from "components/AppContainer"
import ExternalLink from "lib/ExternalLink"
import React from "react"

const Footer = () => (
	<div className="py-4 border-t-4 border-gray-100">
		<AppContainer>
			<div className="flex flex-col sm:flex-row justify-between items-center">

				<div className="order-2 sm:order-1">
					<p className="flex flex-row items-center text-gray-400" style={{ height: "3.5rem" /* h-14 */ }}>
						© 2020 Codex.
					</p>
				</div>

				<div className="order-1 sm:order-2">
					<div className="flex flex-row items-center">

						<Meta.Transition>
							<ExternalLink className="p-4 pr-2 text-gray-400 hover:text-gh-gray" href="https://github.com/codex-src">
								<SVG.GitHubLogo className="w-6 h-6" />
							</ExternalLink>
						</Meta.Transition>

						<Meta.Transition>
							<ExternalLink className="p-4 pl-2 text-gray-400 hover:text-tw-blue" href="https://twitter.com/username_ZAYDEK">
								<SVG.TwitterLogo className="w-6 h-6" />
							</ExternalLink>
						</Meta.Transition>

					</div>
				</div>

			</div>
		</AppContainer>
	</div>
)

export default Footer
