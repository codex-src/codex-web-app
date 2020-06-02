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

const NoteAppFragment = () => {
	const [hoverSettings, setHoverSettings] = React.useState(false)

	const [hoverHideButton, setHoverHideButton] = React.useState(false)
	const [focusHideButton, setFocusHideButton] = React.useState(false)

	const scollingElementRef = React.useRef()
	const [scrollPercent, setScrollPercent] = React.useState(0)

	React.useEffect(() => {
		const handler = () => {
			setScrollPercent(scollingElementRef.current.scrollTop / (scollingElementRef.current.scrollHeight - scollingElementRef.current.offsetHeight))
		}
		scollingElementRef.current.addEventListener("scroll", handler, false)
		return () => {
			scollingElementRef.current.removeEventListener("scroll", handler, false)
		}
	}, [])

	// document.body.classList.toggle("debug-css")

	return (
		<React.Fragment>

			{/* LHS */}
			<div ref={scollingElementRef} className="pb-6 fixed left-0 inset-y-0 flex-none w-80 bg-cool-gray-100 overflow-y-scroll scrolling-touch transform -translate-x-80 lg:translate-x-0 transition duration-500 ease-in-out">

				<header
					// NOTE: Uses duration-300 not duration-150
					className="py-6 sticky top-0 inset-x-0 group bg-cool-gray-100 hover:bg-cool-gray-200 focus:bg-cool-gray-200 border-b-2 border-cool-gray-200 focus:outline-none z-10 transition duration-300 ease-in-out"
					style={{ borderColor: !scrollPercent && "transparent" }}
					tabIndex="0"
					onMouseEnter={() => setHoverSettings(true)}
					onMouseLeave={() => setHoverSettings(false)}
				>

					<div className="px-4 flex flex-row justify-between items-center">
						<div style={{ fontSize: "37.5%" }}>
							<div className="em-context flex flex-row items-center">
								<svg className="w-16 h-16 text-md-blue-a400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
									<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
								<div className="ml-1 -mt-2">
									<h1 className="text-6xl leading-none Poppins Poppins-clip-path-top lowercase" style={{ letterSpacing: "-0.025em" }}>
										Codex
									</h1>
								</div>
							</div>
						</div>
						<button
							// NOTE: hover:text-cool-gray-500 and
							// focus:text-cool-gray-500 does not work
							// because of group-hover and group-focus --
							// uses hoverHideButton and focusHideButton
							className="mr-2 flex-none block text-transparent group-hover:text-cool-gray-400 group-focus:text-cool-gray-400 hover:text-cool-gray-500 focus:text-cool-gray-500 focus:outline-none transition duration-150 ease-in-out"
							style={{ color: (hoverHideButton || focusHideButton) && "var(--cool-gray-500)" }}
							// hover:text-cool-gray-500
							onMouseEnter={() => setHoverHideButton(true)}
							onMouseLeave={() => setHoverHideButton(false)}
							// focus:text-cool-gray-500
							onFocus={() => setFocusHideButton(true)}
							onBlur={() => setFocusHideButton(false)}
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
							</svg>
						</button>
					</div>

					{/* NOTE: Uses mt-5 -mb-1 because of py-1 -- was
					my-t */}
					<div className="!mt-6 mt-5 -mb-1 px-4 py-1 flex flex-row items-center truncate">
						<div className="mr-3 relative flex-none">
							<img className="w-12 h-12 object-cover bg-cool-gray-200 rounded-full shadow-hero" src="https://pbs.twimg.com/profile_images/1217476210910994434/J1XO8K2n_400x400.jpg" alt="" />
							<div className="absolute bottom-0 right-0">
								<div className="p-0.5 bg-tw-blue rounded-full shadow-hero">
									<SVG.TwitterLogo className="w-3 h-3 text-white transform scale-90" />
								</div>
							</div>
						</div>
						<div className="truncate">
							<h2 className="flex flex-row items-center font-medium text-sm leading-6 text-cool-gray-600 group-hover:text-cool-gray-700 transition duration-150 ease-in-out">
								<span className="truncate">
									Russ Perry
								</span>{" "}
								<E className="ml-2">👾</E>{" "}
								<div className="ml-2 px-2 py-1 font-extrabold tracking-wider leading-none text-cool-gray-100 bg-cool-gray-800 rounded-full transform scale-90" style={{ fontSize: "0.625rem" }}>
									UPGRADE
								</div>
							</h2>
							<p className="font-medium text-sm leading-6 truncate text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out">
								<span className="truncate">
									{!hoverSettings ? (
										"Front End Developer and Collector of Video Games"
									) : (
										"Open Settings…"
									)}
								</span>
							</p>
						</div>
					</div>

				</header>

				{/* TODO: Add shortcuts */}
				<nav className="mt-6">
					<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
							</svg>
							<span className="truncate">
								New Note
							</span>
						</p>
					</button>
					<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
							</svg>
							<span className="truncate">
								Import from Computer
							</span>
						</p>
					</button>
					<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
						<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
							<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M2 10a4 4 0 004 4h3v3a1 1 0 102 0v-3h3a4 4 0 000-8 4 4 0 00-8 0 4 4 0 00-4 4zm9 4H9V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V14z" clipRule="evenodd" />
							</svg>
							<span className="truncate">
								Import from URL
							</span>
						</p>
					</button>
				</nav>

				{/* <hr className="mt-6 border-t-2 border-cool-gray-200" /> */}

				<div className="mt-6">

					<nav className="my-2 mt-0">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform rotate-90 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
								</svg>
								<span className="truncate">
									Private
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									JavaScript in 2020
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									Programming isn’t as hard as you think <E>😤</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									How to build a beautiful blog <E>👨🏻‍🍳</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									What I wish I’d known one year ago
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									You don’t know what you don’t know
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									What I learned from Carl Sagan <E>🚀</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									Why I love StarTalk <E>❤️</E>
								</span>
							</p>
						</button>
					</nav>

					<nav className="my-2">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform rotate-90 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
								</svg>
								<span className="truncate">
									Public
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									Why you should learn programming in 2020 <E>👨🏻‍🍳</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									Who really knows what programming is <E>🤔</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									The missing CSS property{" "}
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									To build or not to build a blog <E>🚀</E>
								</span>
							</p>
						</button>
						<button
							className="pr-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<span className="truncate">
									Surprise! You can now fund me on Patreon <E>❤️</E>
								</span>
							</p>
						</button>
					</nav>

					<nav className="my-2">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform rotate-90 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
									<path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Archive
								</span>
							</p>
						</button>
						<div
							className="pr-4 py-1.5"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-400">
								<span className="truncate">
									(Empty)
								</span>
							</p>
						</div>
					</nav>

					<nav className="my-2 mb-0">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform rotate-90 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Trash
								</span>
							</p>
						</button>
						<div
							className="pr-4 py-1.5"
							style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
						>
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-400">
								<span className="truncate">
									(Empty)
								</span>
							</p>
						</div>
					</nav>

					<hr className="mt-6 border-t-2 border-cool-gray-200" />

					<nav className="mt-6">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Readme
								</span>
							</p>
						</button>
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Changelog
								</span>
							</p>
						</button>
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Help & Support
								</span>
							</p>
						</button>
						{/* <button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"> */}
						{/* 	<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out"> */}
						{/* 		<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20"> */}
						{/* 			<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /> */}
						{/* 		</svg> */}
						{/* 		<span className="truncate"> */}
						{/* 			Suggestions & Feedback */}
						{/* 		</span> */}
						{/* 	</p> */}
						{/* </button> */}
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" style={{ transform: "scale(0.8125)" }} fill="currentColor" viewBox="0 0 16 16">
									<path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
								</svg>
								<span className="truncate">
									Contribute on GitHub
								</span>{" "}
								<svg className="ml-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform scale-90 transition duration-150 ease-in-out" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
									<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</p>
						</button>
					</nav>

					<hr className="mt-6 border-t-2 border-cool-gray-200" />

					<nav className="mt-6">
						<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Sign Out
								</span>
							</p>
						</button>
					</nav>

				</div>

				{/* <div */}
				{/* 	// NOTE: Uses duration-300 not duration-150 */}
				{/* 	className="py-6 sticky bottom-0 inset-x-0 bg-cool-gray-100 border-t-2 border-cool-gray-200 z-10 transition duration-300 ease-in-out" */}
				{/* 	style={{ borderColor: scrollPercent === 1 && "transparent" }} */}
				{/* > */}
				{/* 	<nav> */}
				{/* 		<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"> */}
				{/* 			<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out"> */}
				{/* 				<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20"> */}
				{/* 					<path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /> */}
				{/* 				</svg> */}
				{/* 				<span className="truncate"> */}
				{/* 					Changelog */}
				{/* 				</span> */}
				{/* 			</p> */}
				{/* 		</button> */}
				{/* 		<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"> */}
				{/* 			<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out"> */}
				{/* 				<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20"> */}
				{/* 					<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /> */}
				{/* 				</svg> */}
				{/* 				<span className="truncate"> */}
				{/* 					Suggest an Idea or Give Feedback */}
				{/* 				</span> */}
				{/* 			</p> */}
				{/* 		</button> */}
				{/* 		<button className="px-4 py-1.5 group block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"> */}
				{/* 			<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out"> */}
				{/* 				<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20"> */}
				{/* 					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" /> */}
				{/* 				</svg> */}
				{/* 				<span className="truncate"> */}
				{/* 					Help & Support */}
				{/* 				</span> */}
				{/* 			</p> */}
				{/* 		</button> */}
				{/* 	</nav> */}
				{/* </div> */}

			</div>

			{/* RHS */}
			<div className="ml-0 lg:ml-80 px-6 py-24 flex-1">
				{/* x */}
			</div>

		</React.Fragment>
	)
}

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
