import * as routes from "routes"
import * as SVG from "svgs"
import E from "lib/Emoji"
import HomePage from "pages/HomePage"
import PricingPage from "pages/PricingPage"
import React from "react"
import SignInPage from "pages/SignInPage"
import SignUpPage from "pages/SignUpPage"

// TODO: Add archive and trash icons to the right-side of a
// list item

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

const NoteAppFragment = () => (
	<React.Fragment>

		{/* LHS */}
		<div className="fixed left-0 inset-y-0 flex-none hidden lg:block w-80 bg-cool-gray-100 !border-r !border-gray-200 overflow-y-scroll scrolling-touch">

			{/* NOTE: Uses py-5 ... py-1 ... my-1 not py-6 */}
			<div className="py-5 sticky top-0 inset-x-0 bg-cool-gray-100 border-b-2 border-cool-gray-200">

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

				<div className="px-4 flex flex-row items-center truncate">
					{/* <img className="mr-4 flex-none w-10 h-10 object-cover bg-cool-gray-200 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" /> */}

					<div className="mr-3 py-1 relative flex-none">
						<img className="w-12 h-12 object-cover bg-cool-gray-200 rounded-full shadow-hero" src="https://pbs.twimg.com/profile_images/1217476210910994434/J1XO8K2n_400x400.jpg" alt="" />
						<div className="my-1 absolute bottom-0 right-0">
							<div className="p-0.5 bg-tw-blue rounded-full shadow-hero">
								<SVG.TwitterLogo className="w-3 h-3 text-white transform scale-90" />
							</div>
						</div>
					</div>

					<div className="truncate">
						<h2 className="flex flex-row items-center font-medium text-sm leading-6 text-cool-gray-600">
							<span className="truncate">
								Russ Perry
							</span>{" "}
							{/* <SVG.TwitterLogo className="ml-2 w-4 h-4 text-tw-blue" />{" "} */}
							<button className="ml-2 px-2 py-1 block font-extrabold tracking-wider leading-none text-white bg-cool-gray-800 rounded-full" style={{ fontSize: "0.625rem" }}>
								UPGRADE
							</button>
						</h2>

						{/* <p className="font-medium text-sm text-cool-gray-400 leading-5 truncate"> */}
						{/* 	Front End Developer and Collector of Video Games */}
						{/* </p> */}

						{/* <div className="mt-1"> */}
						{/* 	<button className="px-2 py-0.5 block font-extrabold tracking-wider leading-4 uppercase text-cool-gray-100 bg-cool-gray-800 rounded-full transition duration-150 ease-in-out" style={{ fontSize: "0.625rem" }}> */}
						{/* 		Upgrade */}
						{/* 	</button> */}
						{/* </div> */}

						<p className="flex flex-row items-center font-medium text-sm leading-6 text-cool-gray-400">
							<span className="truncate">
								Open Preferences
							</span>{" "}
							<svg className="ml-1 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" stroke="currentColor">
								<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</p>

					</div>

				</div>
			</div>

			<nav className="mt-6">
				<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
					<p className="flex flex-row items-center font-medium text-sm leading-5">
						<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" stroke="currentColor">
							<path d="M12 4v16m8-8H4" />
						</svg>
						<span className="truncate">
							New Note
						</span>
					</p>
				</button>
				<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
					<p className="flex flex-row items-center font-medium text-sm leading-5">
						<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" stroke="currentColor">
							<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>
						<span className="truncate">
							Import from Computer
						</span>
					</p>
				</button>
				<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
					<p className="flex flex-row items-center font-medium text-sm leading-5">
						<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
						</svg>
						<span className="truncate">
							Import from GitHub
						</span>
					</p>
				</button>
			</nav>

			<div className="py-6">

				<nav>
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
							<span className="truncate">
								All Notes
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								JavaScript in 2020
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								Programming isn’t as hard as you think <E>😤</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 rounded focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								How to build a beautiful blog <E>👨🏻‍🍳</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								What I wish I’d known one year ago
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								You don’t know what you don’t know
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								What I learned from Carl Sagan <E>🚀</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								Why I love StarTalk <E>❤️</E>
							</span>
						</p>
					</button>
				</nav>

				<nav className="mt-6">
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
							</svg>
							<span className="truncate">
								Shared Notes
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 rounded focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								Why you should learn programming in 2020 <E>👨🏻‍🍳</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								Who really knows what programming is <E>🤔</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								The missing CSS property{" "}
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								To build or not to build a blog <E>🚀</E>
							</span>
						</p>
					</button>
					<button
						className="pr-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
						style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
					>
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<span className="truncate">
								Surprise! You can now fund me on Patreon <E>❤️</E>
							</span>
						</p>
					</button>
				</nav>

				<nav className="mt-6">
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
							</svg>
							<span className="truncate">
								Archive
							</span>
						</p>
					</button>
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							<span className="truncate">
								Trash
							</span>
						</p>
					</button>
				</nav>

				<nav className="mt-6">
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
							</svg>
							<span className="truncate">
								Sign Out
							</span>
						</p>
					</button>
				</nav>

			</div>

			<div className="py-6 sticky bottom-0 inset-x-0 bg-cool-gray-100 border-t-2 border-cool-gray-200">

				<nav>
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
							<span className="truncate">
								Feedback and Support
							</span>
						</p>
					</button>
					<button className="px-4 py-1.5 block w-full text-cool-gray-500 hover:text-cool-gray-600 focus:text-cool-gray-600 hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
								<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
							<span className="truncate">
								Open Source
							</span>
						</p>
					</button>
				</nav>

			</div>

		</div>

		{/* RHS */}
		<div className="ml-0 lg:ml-80 px-6 py-24 flex-1">
			{/* x */}
		</div>

	</React.Fragment>
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
				<NoteAppFragment />
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
