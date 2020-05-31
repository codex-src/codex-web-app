import * as Meta from "components/Meta"
import * as SVG from "svgs"
import CodexLogo from "components/CodexLogo"
import E from "lib/Emoji"
import React from "react"
import { SplitViewLHSBlock } from "./SplitView"

const SignInForm = () => (
	<form>

		<Meta.HeaderBlock>
			<h1>
				Sign In
			</h1>
			<h2 className="flex flex-row items-center">
				to continue with
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
		<div className="mt-1 grid grid-cols-3 gap-3">
			<div className="rounded-md shadow-sm">
				<Meta.SocialButton>
					<button aria-label="Sign in with GitHub">
						<SVG.GitHubLogo className="w-5 h-5 text-gh-gray" />
					</button>
				</Meta.SocialButton>
			</div>
			<div className="rounded-md shadow-sm">
				<Meta.SocialButton>
					<button aria-label="Sign in with Twitter">
						<SVG.TwitterLogo className="w-5 h-5 text-tw-blue" />
					</button>
				</Meta.SocialButton>
			</div>
			<div className="rounded-md shadow-sm">
				<Meta.SocialButton>
					<button aria-label="Sign in with Google">
						<SVG.GoogleLogo className="w-5 h-5" />
					</button>
				</Meta.SocialButton>
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
				placeholder="leonardo@codexapp.dev"
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
				placeholder="••••••••"
				spellCheck={false}
				type="password"
			/>
		</Meta.InputBlock>

		{/* Uses mt-8 not mt-6 */}
		<div className="mt-8">
			<div className="rounded-md shadow-sm">
				<Meta.Focusable>
					{/* Uses py-3 not py-2 */}
					<button className="px-4 py-3 w-full font-bold text-sm tracking-wider leading-5 text-white bg-md-blue-a400 border border-transparent rounded-md">
						SIGN IN
					</button>
				</Meta.Focusable>
			</div>
		</div>

		<div className="mt-4">
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
