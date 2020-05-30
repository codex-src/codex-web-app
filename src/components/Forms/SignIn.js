import * as Meta from "components/Meta"
import * as SVG from "svgs"
import CodexLogo from "components/CodexLogo"
import React from "react"
import { SplitViewLHSBlock } from "./SplitView"

const SignInForm = () => (
	<form>

		<Meta.HeaderBlock>
			<h1>
				Sign In
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
					Sign in with
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
			<div className="relative flex flex-row justify-center">
				<div className="px-2 text-sm leading-5 text-gray-500 bg-white">
					Or use your email address
				</div>
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
				placeholder="email@address.com"
				spellCheck={false}
				type="text"
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
				placeholder="••••••••••"
				spellCheck={false}
				type="password"
			/>
		</Meta.InputBlock>

		<div className="mt-12">
			<div className="rounded-md shadow-sm">
				<Meta.Focusable>
					<button className="flex flex-row justify-center w-full h-12 bg-md-blue-a400 rounded-md hover:opacity-90 active:opacity-100" type="submit">
						<Meta.SelectNone>
							<p className="flex flex-row items-center font-semibold text-px tracking-px text-white">
								Sign In{" "}
								<span className="ml-2" style={{ transform: "scaleX(-1)" }} aria-label="waving hand" role="img">👋</span>
							</p>
						</Meta.SelectNone>
					</button>
				</Meta.Focusable>
			</div>
		</div>

		<div className="mt-6">
			<p className="text-sm text-gray-600">
				We’ll keep you signed in until you click <span className="underline">Sign Out</span>.
			</p>
		</div>

	</form>
)

const SignIn = () => (
	<SplitViewLHSBlock>
		<SignInForm />
		<img className="bg-gray-200" src="https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="" />
	</SplitViewLHSBlock>
)

export default SignIn
