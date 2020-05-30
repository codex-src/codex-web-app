import CodexLogo from "components/CodexLogo"
import React from "react"
import { SplitViewRHS } from "./SplitView"

import {
	MetaFocusable,
	MetaHeaderBlock,
	MetaInputBlock,
	MetaLabel,
} from "./Meta"

import {
	GitHubLogo,
	GoogleLogo,
} from "svgs"

// document.body.classList.toggle("debug-css")

const SignUpFormFragment = () => (
	<React.Fragment>

		{/* Header */}
		<MetaHeaderBlock>
			<h1>
				Sign <span className="Poppins-clip-path-bottom">Up</span>
			</h1>
			<h2 className="flex flex-row items-center">
				<span className="Poppins-clip-path-bottom">to continue with</span>
				<span className="ml-1" style={{ fontSize: "31.25%" }}>
					<CodexLogo />
				</span>
			</h2>
		</MetaHeaderBlock>

		{/* Sign in with */}
		<div className="mt-8">
			<MetaLabel>
				<p>
					Sign up with
				</p>
			</MetaLabel>
		</div>

		{/* Sign in with */}
		<div className="mt-1 grid grid-cols-2 gap-3">
			<div className="rounded-md shadow-sm">
				<MetaFocusable>
					{/* Added bg-github-gray, removed border
					border-gray-300 */}
					<button className="form-input flex flex-row justify-center w-full h-12 bg-github-gray border-none hover:opacity-90 active:opacity-100" aria-label="Sign in with GitHub">
						<GitHubLogo className="w-6 h-6 text-white" />
					</button>
				</MetaFocusable>
			</div>
			<div className="rounded-md shadow-sm">
				<MetaFocusable>
					<button className="form-input flex flex-row justify-center w-full h-12 border border-gray-300 hover:opacity-90 active:opacity-100" type="button" aria-label="Sign in with Google">
						<GoogleLogo className="w-6 h-6" />
					</button>
				</MetaFocusable>
			</div>
		</div>

		{/* Or use your email address */}
		<div className="mt-6 relative">
			<div className="absolute inset-0 flex flex-row items-center">
				<div className="w-full border-t border-gray-300"></div>
			</div>
			<div className="relative flex flex-row justify-center text-sm leading-5">
				<span className="px-2 bg-white text-gray-500">
					Or use your email address
				</span>
			</div>
		</div>

		<form className="mt-6">

			<MetaInputBlock>
				<label htmlFor="email">
					Email address
				</label>
				<input
					// Sorted
					autoComplete="username"
					id="email"
					required
					spellCheck={false}
					type="email"
				/>
			</MetaInputBlock>

			<MetaInputBlock className="mt-6">
				<label htmlFor="password">
					Password
				</label>
				<input
					// Sorted
					autoComplete="new-password"
					id="password"
					required
					spellCheck={false}
					type="password"
				/>
			</MetaInputBlock>

			<div className="mt-12">
				<div className="rounded-md shadow-sm">
					<MetaFocusable>
						<button className="flex flex-row justify-center w-full h-12 bg-md-blue-a400 rounded-md hover:opacity-90 active:opacity-100" type="submit">
							<p className="flex flex-row items-center font-semibold text-px tracking-px text-white">
								Create Your Codex{" "}
								<span className="ml-2" aria-label="partying face" role="img">🥳</span>
							</p>
						</button>
					</MetaFocusable>
				</div>
			</div>

			<div className="mt-6">
				<p className="text-sm text-gray-600">
					By clicking ‘Create Your Codex’,{" "}
					you agree to our <a href="TODO" className="underline">Terms of Service</a> and <a href="TODO" className="underline">Privacy Policy</a>.{" "}
					We’ll occasionally send you account related emails.
				</p>
			</div>

		</form>

	</React.Fragment>
)

const SignUp = () => (
	<SplitViewRHS>
		<img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="" />
		<SignUpFormFragment />
	</SplitViewRHS>
)

export default SignUp
