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
		<div className="w-full">
			{children[1]}
		</div>
	</div>
)

// document.body.classList.toggle("debug-css")

const featured = [
	{
		href: "https://unsplash.com/photos/Jb56veoOqG0",
		src:  "https://images.unsplash.com/photo-1581994324332-bd9690e72f86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80",
		text: "Featuring EPCOT, Disney World \u00a0· \u00a0Photo by Brian McGowan",
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
						<a className="m-2 px-2 py-1 flex flex-row items-center text-sm bg-white rounded-full" style={{ boxShadow: "0 0 0 0.1875rem #0000001f" }} href={href} target="_blank" rel="noopener noreferrer">
							<svg className="mr-2 w-4 h-4 text-md-blue-a200 transform scale-110" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" fillRule="evenodd" />
							</svg>
							{text}
						</a>
					</div>

				</React.Fragment>
			))(featured[0])}

		</div>

		{/* RHS */}
		<div>
			hello
		</div>

	</SplitView>
)

export default SignUp
