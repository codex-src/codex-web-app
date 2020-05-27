import CodexLogo from "components/CodexLogo"
import CodexSVG from "components/CodexSVG"
import React from "react"

// <div className="px-24 py-32 w-full max-w-xl">
// 	<CodexSVG className="w-10 h-10 text-md-blue-a400" />
// 	<div className="h-2" />
// 	<h2 className="font-semibold text-3xl Poppins text-gray-900">
// 		Welcome to Codex
// 		{/* &nbsp;<span aria-label="waving hand" role="img">👋</span> */}
// 	</h2>

// <SplitView>
//
// 	{/* LHS */}
// 	{/* ... */}
//
// 	{/* RHS */}
// 	{/* ... */}
//
// </SplitView>
//
const SplitView = ({ children }) => (
	<div className="flex flex-row h-full">
		<div className="hidden xl:block w-full">
			{children[0]}
		</div>
		{/* FIXME */}
		<div className="-mx-8 w-full">
			{children[1]}
		</div>
	</div>
)

// document.body.classList.toggle("debug-css")

const featured = [
	{
		href: "https://unsplash.com/photos/pVt9j3iWtPM",
		src:  "https://images.unsplash.com/photo-1528297506728-9533d2ac3fa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
		text: "Photo by Leone Venter",
	},
]

const SignUp = () => (
	<SplitView>

		{/* LHS */}
		<div className="relative h-full">

			{(({ src, href, text }) => (
				<React.Fragment>

					{/* Featured photo */}
					<img className="absolute inset-0 h-full w-full object-cover" src={src} alt="" />
					<div className="absolute bottom-0 left-0">

						{/* Featured photo tag */}
						<a className="m-2 px-2 py-1 flex flex-row items-center text-sm bg-white bg-opacity-75 rounded-md" style={{ boxShadow: "0 0 0 0.1875rem #0001" }} href={href} target="_blank" rel="noopener noreferrer">
							<svg className="mr-2 w-4 h-4 text-md-blue-a400 transform scale-110" fill="currentColor" viewBox="0 0 20 20">
								<path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" fillRule="evenodd" />
							</svg>
							{text}
						</a>
					</div>

				</React.Fragment>
			))(featured[Math.floor(Math.random() * featured.length)])}

		</div>

		{/* RHS */}
		<div className="px-24 py-48">

			<div className="h-6" />
			<div className="flex flex-col items-center">
				<h2 className="flex flex-row items-center whitespace-pre font-medium text-4xl Poppins" style={{ clipPath: "inset(0 0 18.75% 0)" }}>
					Create your
					<div className="ml-2" style={{ fontSize: "28.75%" }}>
						<CodexLogo />
					</div>
				</h2>
			</div>

			<div className="h-6" />
			<label for="email" className="block text-sm tracking-wide text-md-blue-a400">
				Email address
				<div className="mt-1 rounded-md shadow-sm">
					{/* focusable w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 */}
					<input type="email" required className="px-3 py-2 block w-full border rounded-md focus:outline-none" />
				</div>
			</label>

		</div>

	</SplitView>
)

// <div className="h-6" />
// <div className="flex flex-col items-center">
// 	<h2 className="font-medium text-4xl Poppins">
// 		Sign Up
// 	</h2>
// 	<div className="h-2" />
// 	<h3 className="flex flex-row items-center text-lg Poppins">
// 		to continue with
// 		<div className="ml-1" style={{ fontSize: "37.5%" }}>
// 			<CodexLogo />
// 		</div>
// 	</h3>
// </div>

export default SignUp
