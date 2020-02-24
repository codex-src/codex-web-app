import * as Feather from "react-feather"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"

const SignInWithGitHub = props => (
	// Based on Nav CTA:
	<div className="px-4 py-3 flex flex-row justify-center items-center w-full bg-gray-900 hover:bg-gray-800 rounded-lg shadow-hero hover:shadow-hero-md cursor-pointer select-none tx-150">
		<div className="mr-3">
			<GitHubLogo className="w-6 h-6 text-white" />
		</div>
		<p className="font-semibold text-px tracking-px text-white">
			Continue with GitHub
		</p>
	</div>
)

const SignInWithGoogle = props => (
	// Based on Nav CTA:
	<div className="px-4 py-3 flex flex-row justify-center items-center w-full bg-white hover:bg-gray-100 rounded-lg shadow-hero hover:shadow-hero-md cursor-pointer select-none tx-150">
		<div className="mr-3">
			<GoogleLogo className="w-6 h-6" />
		</div>
		<p className="font-semibold text-px tracking-px text-gray-900">
			Continue with Google
		</p>
	</div>
)

const Auth = props => (
	<div className="p-6 py-64 flex flex-row justify-center">
		<div className="flex flex-col items-center w-64">

			{/* Logo; based on Nav LHS: */}
			<div className="flex flex-row items-center transform scale-110">
				<div className="mr-3 text-md-blue-a400">
					<Feather.Layers className="w-6 h-6" />
				</div>
				<CodexLogo className="w-24 h-6" />
			</div>

			<div className="h-12" />

			{/* Buttons: */}
			<SignInWithGitHub />
			<div className="h-2" />
			<SignInWithGoogle />

		</div>
	</div>
)

export default Auth
