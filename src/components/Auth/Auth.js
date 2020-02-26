import * as Feather from "react-feather"
import CSSDebugger from "utils/CSSDebugger"
import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"

const Auth = props => (
	<div className="px-6 py-12 flex flex-row justify-center items-center min-h-full bg-gray-50">
		<div className="w-72">

			{/* Logo: */}
			<div className="my-6 flex flex-row justify-center items-center transform scale-110 origin-bottom">
				<div className="mr-3 text-md-blue-a400">
					<Feather.Layers className="w-6 h-6" />
				</div>
				<CodexLogo className="w-24 h-6" />
			</div>

			{/* Subtext: */}
			<p className="my-6 text-center font-medium text-lg text-gray-900">
				Choose one of the following to{" "}
				continue with <Link className="text-md-blue-a400" to="https://opencodex.dev">Codex</Link>:
			</p>

			{/* GitHub: */}
			<div className="my-2 px-4 py-3 flex flex-row items-center w-full bg-gray-900 hover:bg-gray-800 rounded-md shadow-hero cursor-pointer select-none tx-75">
				<div className="mx-4">
					<GitHubLogo className="w-6 h-6 text-gray-100" />
				</div>
				<p className="font-semibold text-px text-gray-100">
					Continue with GitHub
				</p>
			</div>

			{/* Google: */}
			<div className="my-2 px-4 py-3 flex flex-row items-center w-full bg-white hover:bg-gray-100 rounded-md shadow-hero cursor-pointer select-none tx-75">
				<div className="mx-4">
					<GoogleLogo className="w-6 h-6 text-gray-900" />
				</div>
				<p className="font-semibold text-px text-gray-900">
					Continue with Google
				</p>
			</div>

			{/* Google: */}
			<div className="my-2 px-4 py-3 flex flex-row justify-center items-center w-full bg-white hover:bg-gray-100 rounded-md shadow-hero cursor-pointer select-none tx-75">
				{/* <div className="mx-4"> */}
					{/* <GoogleLogo className="w-6 h-6 text-gray-900" /> */}
				{/* </div> */}
				<p className="font-semibold text-px text-gray-900">
					Or continue with email
				</p>
			</div>

			{/* Subtext: */}
			<p className="my-6 text-center font-medium text-lg text-gray-900">
				Or <Link className="text-md-blue-a400" to="https://opencodex.dev/support">click here</Link> for support
			</p>

		</div>
	</div>
)

export default Auth
