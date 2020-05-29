import CodexLogo from "components/CodexLogo"
import trimSpaces from "lib/trimSpaces"
import CodexSVG from "components/CodexSVG"
import React from "react"

import {
	GitHubLogo,
	GoogleLogo,
	TwitterLogo,
} from "svgs"

const MetaFocusable = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`
			focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out
				${children.props.className}
					${className}`),
	})
)

const MetaHeaderBlock = ({ className, children: [h1, h2] }) => (
	<div className={trimSpaces(`select-none ${className}`)}>
		{React.cloneElement(h1, {
			className: trimSpaces(`
				font-medium text-3xl sm:text-4xl Poppins
					${h1.props.className}`),
		})}
		{h2 && (
			React.cloneElement(h2, {
				className: trimSpaces(`
					text-lg Poppins
						${h2.props.className}`),
			})
		)}
	</div>
)

const MetaLabel = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`
			block font-medium text-sm leading-5 text-gray-700
				${children.props.className}
					${className}`),
	})
)

const MetaInputBlock = ({ className, children: [label, input] }) => (
	<div className={className}>
		{/* {React.cloneElement(label, { */}
		{/* 	className: trimSpaces(` */}
		{/* 		block font-medium text-sm tracking-px leading-5 text-gray-700 */}
		{/* 			${label.props.className}`), */}
		{/* })} */}
		<MetaLabel>
			{label}
		</MetaLabel>
		<div className="mt-1 rounded-md shadow-sm">
			{/* NOTE: <MetaFocusable> is not needed because of
			form-input */}
			{React.cloneElement(input, {
				className: trimSpaces(`
					form-input w-full transition duration-150 ease-in-out
						${input.props.className}`),
			})}
		</div>
	</div>
)

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

		{/* Form */}
		<div className="mt-8">

			{/* Sign in with */}
			<div>
				<MetaLabel>
					<p>
						Sign up with
					</p>
				</MetaLabel>
			</div>

			{/* Sign in with */}
			<div className="mt-1 grid grid-cols-2 gap-3">
				<div>
					<span className="w-full inline-flex rounded-md shadow-sm">
						<MetaFocusable>
							{/* Added bg-github-gray, removed border
							border-gray-300 */}
							<button className="form-input flex flex-row justify-center w-full h-12 bg-github-gray border-none hover:opacity-90 active:opacity-100" aria-label="Sign in with GitHub">
								<GitHubLogo className="w-6 h-6 text-white" />
							</button>
						</MetaFocusable>
					</span>
				</div>
				<div>
					<span className="w-full inline-flex rounded-md shadow-sm">
						<MetaFocusable>
							<button className="form-input flex flex-row justify-center w-full h-12 border border-gray-300 hover:opacity-90 active:opacity-100" type="button" aria-label="Sign in with Google">
								<GoogleLogo className="w-6 h-6" />
							</button>
						</MetaFocusable>
					</span>
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

			<div className="mt-6">
				<form action="#" method="POST">

					{/* Email address */}
					<MetaInputBlock className="mt-6">
						<label htmlFor="email">
							Email address
						</label>
						<input id="email" type="email" required spellCheck={false} />
					</MetaInputBlock>

					{/* Password */}
					<MetaInputBlock className="mt-6">
						<label htmlFor="password">
							Password
						</label>
						<input id="password" type="password" required spellCheck={false} />
					</MetaInputBlock>

					{/* Sign Up for Codex */}
					<div className="mt-12">
						<MetaFocusable>
							{/* Uses shadow-md */}
							<button className="flex flex-row justify-center w-full h-12 bg-md-blue-a400 rounded-md shadow-md hover:opacity-90 active:opacity-100" type="submit">
								<p className="flex flex-row items-center text-px tracking-px font-medium text-white">
									Create Your Codex
									{/* {" "} */}
									{/* <span className="ml-2" aria-label="partying face" role="img">🥳</span> */}
								</p>
							</button>
						</MetaFocusable>
					</div>

					{/* Legal disclaimer */}
					<div className="mt-6">
						<p className="text-sm text-gray-600">
							By clicking ‘Create Your Codex’,{" "}
							you agree to our <a href="TODO" className="underline">Terms of Service</a> and <a href="TODO" className="underline">Privacy Policy</a>.{" "}
							We’ll occasionally send you account related emails.
						</p>
					</div>

				</form>
			</div>

		</div>

	</React.Fragment>
)

const SignUp = () => (
	<div className="flex flex-row justify-center min-h-screen">

		{/* LHS */}
		<div className="flex-1 hidden lg:block bg-gray-100">
			<img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" />
		</div>

		{/* RHS */}
		<div className="lg:mr-12 flex-none flex flex-row justify-center items-center w-full max-w-xl">
			<div className="px-6 py-24 flex-none w-full max-w-md">
				<SignUpFormFragment />
			</div>
		</div>

	</div>
)

export default SignUp
