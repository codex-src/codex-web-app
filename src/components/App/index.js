import * as routes from "routes"
import E from "lib/Emoji"
import HomePage from "pages/HomePage"
import PricingPage from "pages/PricingPage"
import React from "react"
import SignInPage from "pages/SignInPage"
import SignUpPage from "pages/SignUpPage"

import {
	BrowserRouter,
	Route,
	Switch,
} from "react-router-dom"

/* eslint-disable jsx-a11y/accessible-emoji */

// document.body.classList.toggle("debug-css")

// // Generates a random 4-character key.
// function shortKey() {
// 	return Math.random()
// 		.toString(16)
// 		.slice(2, 6)
// }

const NoteApp = () => (
	<div className="flex flex-row min-h-screen">

		<div className="px-4 py-6 flex-shrink-0 hidden lg:flex lg:flex-col lg:justify-between w-80 bg-cool-gray-100">

			<div>

				<div className="mb-12 flex flex-row justify-between items-center">

					{/* <div style={{ fontSize: "50%" }}> */}
					{/* 	<div className="em-context flex flex-row items-center"> */}
					{/* 		<svg className="w-16 h-16 text-md-blue-a400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" stroke="currentColor"> */}
					{/* 			<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /> */}
					{/* 		</svg> */}
					{/* 		<div className="ml-1 -mt-2"> */}
					{/* 			<h1 className="text-6xl leading-none Poppins Poppins-clip-path-top lowercase" style={{ letterSpacing: "-0.025em" }}> */}
					{/* 				Codex */}
					{/* 			</h1> */}
					{/* 		</div> */}
					{/* 	</div> */}
					{/* </div> */}

					<div className="flex flex-row items-center truncate">
						{/* <img className="mr-4 flex-none w-10 h-10 object-cover bg-cool-gray-200 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /> */}
						<img className="mr-3 flex-none w-10 h-10 object-cover bg-cool-gray-200 rounded-full" src="https://pbs.twimg.com/profile_images/1217476210910994434/J1XO8K2n_400x400.jpg" alt="" />
						<div className="truncate">
							<h2 className="flex flex-row items-center font-medium text-sm leading-5 text-gray-900">
								<span className="truncate">Russ Perry</span>{" "}
								<E className="ml-1">👾</E>
							</h2>
							<p className="font-medium text-sm text-gray-500 leading-6 truncate">
								Front End Developer and Collector of Video Games
								{/* Developer-in-training,{" "} */}
								{/* <span className="mx-1"><E>👀</E></span>{" "} */}
								{/* looking to make his mark on the world. */}
							</p>

							{/* <div className="mt-1"> */}
							{/* 	<button className="px-2 py-0.5 block font-extrabold tracking-wider leading-4 text-white bg-gh-gray rounded-full" style={{ fontSize: "0.625rem" }}> */}
							{/* 		PRO */}
							{/* 	</button> */}
							{/* </div> */}

						</div>
					</div>

					{/* <button className="flex-none flex flex-row justify-center items-center w-8 h-8 bg-cool-gray-300 hover:bg-gh-gray focus:bg-gh-gray rounded-full focus:outline-none transition duration-150 ease-in-out"> */}
					{/* 	<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"> */}
					{/* 		<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /> */}
					{/* 	</svg> */}
					{/* </button> */}

				</div>

				<nav className="mt-8">
					<div className="mt-4">

						<h2 className="font-semibold text-xs tracking-wider leading-6 uppercase truncate text-cool-gray-400">
							Starred
							{/* {" "} */}
							{/* <svg className="ml-1 w-4 h-4 text-cool-gray-300" fill="currentColor" viewBox="0 0 20 20"> */}
							{/* 	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /> */}
							{/* </svg> */}
						</h2>

						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
									<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<span className="truncate">JavaScript in 2020</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🧠</E>
								</span>
								<span className="truncate">Programming isn’t as hard as you think</span>
							</p>
						</div>

					</div>
				</nav>

				<nav className="mt-8">
					<div className="mt-4">

						<h2 className="font-semibold text-xs tracking-wider leading-6 uppercase truncate text-cool-gray-400">
							Drafts
						</h2>

						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
									<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<span className="truncate">How to build a beautiful blog</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🤔</E>
								</span>
								<span className="truncate">What I wish I’d known one year ago</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🤦‍♀️</E>
								</span>
								<span className="truncate">You don’t know what you don’t know</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🚀</E>
								</span>
								<span className="truncate">What I learned from Carl Sagan</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>👏</E>
								</span>
								<span className="truncate">Why I love StarTalk</span>
							</p>
						</div>

					</div>
				</nav>

				<nav className="mt-8">
					<div className="mt-4">

						<h2 className="font-semibold text-xs tracking-wider leading-6 uppercase truncate text-cool-gray-400">
							Shared
						</h2>

						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
									<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<span className="truncate">Why you should learn programming in 2020</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🤷‍♀️</E>
								</span>
								<span className="truncate">Who really knows what programming is?</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🎨</E>
								</span>
								<span className="truncate">The missing CSS property</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
									<path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<span className="truncate">To build or not to build a blog</span>
							</p>
						</div>
						<div className="-mx-4 px-4 py-1.5 hover:bg-cool-gray-200 transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500">
								<span className="mr-2 flex-shrink-0 inline-flex flex-row justify-center items-center w-5 h-5">
									<E>🥳</E>
								</span>
								<span className="truncate">Surprise! You can now fund me on Patreon</span>
							</p>
						</div>

					</div>
				</nav>

			</div>

			<nav>
				<div>
					<button className="flex flex-row items-center w-full font-medium text-sm leading-5 text-cool-gray-500">
						<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
						</svg>
						<span className="truncate">Archive</span>
					</button>
				</div>
				<div className="mt-4">
					<button className="flex flex-row items-center w-full font-medium text-sm leading-5 text-cool-gray-500">
						<svg className="mr-2 flex-shrink-0 w-5 h-5 text-cool-gray-400" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" fill="none" viewBox="0 0 24 24">
							<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						<span className="truncate">Trash</span>
					</button>
				</div>
			</nav>

		</div>

		<div className="px-6 py-24 flex-1">
			{/* x */}
		</div>

	</div>
)

const App = () => (
	<BrowserRouter>
		<Switch>

			{/* TODO: Extract to <UnauthHome> */}

			<Route path={routes.PRICING}>
				<PricingPage />
			</Route>
			<Route path={routes.SIGN_IN}>
				<SignInPage />
			</Route>
			<Route path={routes.SIGN_UP}>
				<SignUpPage />
			</Route>
			<Route path={routes.HOME}>
				{/* <HomePage /> */}
				<NoteApp />
			</Route>

			{/* <Route */}
			{/* 	path={constants.PATH_README} */}
			{/* 	title="Readme" */}
			{/* 	exact */}
			{/* 	// NOTE: Use key because <Note> is shared */}
			{/* 	children={<Note key={random.newFourByteHash()} noteID={constants.NOTE_ID_README} />} */}
			{/* /> */}

		</Switch>
	</BrowserRouter>
)

export default App
