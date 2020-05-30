import * as Meta from "./Meta"
import * as SVG from "svgs"
import CodexLogo from "components/CodexLogo"
import React from "react"
import { SplitViewLHSBlock } from "./SplitView"

// document.body.classList.toggle("debug-css")

const SignInForm = () => (
	<form>

		<Meta.HeaderBlock>
			<h1>
				Sign <span className="Poppins-clip-path-bottom">Up</span>
			</h1>
			<h2 className="flex flex-row items-center">
				<span className="Poppins-clip-path-bottom">to continue with</span>
				<span className="ml-1" style={{ fontSize: "31.25%" }}>
					<CodexLogo />
				</span>
			</h2>
		</Meta.HeaderBlock>

		<div className="mt-8">
			<Meta.Label>
				<p>
					Sign up with
				</p>
			</Meta.Label>
		</div>

		<div className="mt-1 grid grid-cols-2 gap-3">
			<div className="rounded-md shadow-sm">
				<Meta.Focusable>
					{/* Added bg-github-gray, removed border
					border-gray-300 */}
					<button className="form-input flex flex-row justify-center w-full h-12 bg-github-gray border-none hover:opacity-90 active:opacity-100" aria-label="Sign in with GitHub">
						<SVG.GitHubLogo className="w-6 h-6 text-white" />
					</button>
				</Meta.Focusable>
			</div>
			<div className="rounded-md shadow-sm">
				<Meta.Focusable>
					<button className="form-input flex flex-row justify-center w-full h-12 border border-gray-300 hover:opacity-90 active:opacity-100" type="button" aria-label="Sign in with Google">
						<SVG.GoogleLogo className="w-6 h-6" />
					</button>
				</Meta.Focusable>
			</div>
		</div>

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

		<Meta.InputBlock className="mt-6">
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
		</Meta.InputBlock>

		<Meta.InputBlock className="mt-6">
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
		</Meta.InputBlock>

		<div className="mt-12">
			<div className="rounded-md shadow-sm">
				<Meta.Focusable>
					<button className="flex flex-row justify-center w-full h-12 bg-md-blue-a400 rounded-md hover:opacity-90 active:opacity-100" type="submit">
						<p className="flex flex-row items-center font-semibold text-px tracking-px text-white">
							Create Your Codex{" "}
							<span className="ml-2" aria-label="partying face" role="img">🥳</span>
						</p>
					</button>
				</Meta.Focusable>
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
)

const SignIn = () => (
	<SplitViewLHSBlock>
		<SignInForm />
		<img src="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80" alt="" />
	</SplitViewLHSBlock>
)

export default SignIn
