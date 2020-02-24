import * as Feather from "react-feather"
import CSSDebugger from "utils/CSSDebugger"
import React from "react"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"
import { ReactComponent as Logo } from "svg/codex.svg"

const SignInWithGitHub = props => (
	<div className="py-3 flex flex-row justify-center items-center w-full bg-gray-900 hover:bg-gray-800 rounded-lg shadow-hero hover:shadow-hero-md select-none cursor-pointer trans-150">
		<div className="mr-3.5">
			<GitHubLogo className="p-px w-7 h-7 text-white" />
		</div>
		<p className="font-600 text-px tracking-px text-white">
			Continue with GitHub
		</p>
	</div>
)

const SignInWithGoogle = props => (
	<div className="py-3 flex flex-row justify-center items-center w-full bg-white hover:bg-gray-100 rounded-lg shadow-hero hover:shadow-hero-md select-none cursor-pointer trans-150">
		<div className="mr-3.5">
			<GoogleLogo className="p-px w-7 h-7" />
		</div>
		<p className="font-600 text-px tracking-px text-gray-900">
			Continue with Google
		</p>
	</div>
)

const Auth = props => (
	<div className="p-6 flex flex-row justify-center items-center items-start h-full bg-md-gray-600">
		<div className="p-6 pt-12 py-6 flex flex-col items-center w-full max-w-xs bg-white rounded-lg shadow-hero-lg">
			<div className="flex flex-row justify-center items-center">
				<Feather.Layers className="w-7 h-7 text-md-blue-a400" />
				<div className="w-3.5" />
				<Logo style={{ width: 28 * 4, height: 28 }} />
			</div>
			<div className="h-6" />
			<p className="text-center font-500 text-lg leading-1.4 text-gray-900">
				Choose one of the following to continue with Codex:
			</p>
			<div className="h-9" />
			<SignInWithGitHub />
			<div className="h-3" />
			<SignInWithGoogle />
			<div className="h-9" />
			<p className="font-500 text-gray-700 hover:text-md-blue-a400 cursor-pointer">
				Click here for help
			</p>
		</div>
	</div>
)

export default Auth
