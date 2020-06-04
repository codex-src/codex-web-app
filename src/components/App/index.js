// import HomePage from "pages/HomePage"
// import Transition from "lib/Transition"
import * as routes from "routes"
import E from "lib/Emoji"
import PricingPage from "pages/PricingPage"
import React from "react"
import SignInPage from "pages/SignInPage"
import SignUpPage from "pages/SignUpPage"
import TransitionV2 from "lib/TransitionV2"

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

const NoteItem = ({ children }) => {
	const ref = React.useRef()

	const [hovered, setHovered] = React.useState(false)
	const [focused, setFocused] = React.useState(false)

	return (
		<div
			ref={ref}
			className="pr-4 py-1.5 group hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out cursor-pointer"
			style={{ paddingLeft: "1.625rem" /* pl-6.5 */ }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			tabIndex={0}
		>
			<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
				<span className="truncate">
					{children}
				</span>
				<span
					// NOTE: Do not use add transition classes because
					// of width: 0
					className="ml-auto flex flex-row items-center"
					style={{ width: (!hovered && !focused) && 0, opacity: (!hovered && !focused) && 0 }}
				>
					<button
						className="group inline-block w-full text-cool-gray-400 hover:text-cool-gray-500 focus:text-cool-gray-500 focus:outline-none transform scale-90 transition duration-150 ease-in-out"
						onBlur={e => e.stopPropagation()}
					>
						<svg className="ml-1 w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
							<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
					</button>
					<button
						className="group inline-block w-full text-cool-gray-400 hover:text-cool-gray-500 focus:text-cool-gray-500 focus:outline-none transform scale-90 transition duration-150 ease-in-out"
						onBlur={e => e.stopPropagation()}
					>
						<svg className="ml-1 w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
							<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
						</svg>
					</button>
					<button
						className="group inline-block w-full text-cool-gray-400 hover:text-red-600 focus:text-red-600 focus:outline-none transform scale-90 transition duration-150 ease-in-out"
						// onBlur={e => e.stopPropagation()}
					>
						<svg className="ml-1 w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
							<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</span>
			</p>
		</div>
	)
}

const NoteAppFragment = () => {
	const [showSidebar, setShowSidebar] = React.useState(true)
	const [hoveredAccount, setHoveredAccount] = React.useState(false)

	const scollingElementRef = React.useRef()
	const [scrollPercent, setScrollPercent] = React.useState(0)

	React.useEffect(() => {
		// react-hooks/exhaustive-deps
		const scollingElement = scollingElementRef.current
		const handler = () => {
			setScrollPercent(scollingElement.scrollTop / (scollingElement.scrollHeight - scollingElement.offsetHeight))
		}
		scollingElement.addEventListener("scroll", handler, false)
		return () => {
			scollingElement.removeEventListener("scroll", handler, false)
		}
	}, [])

	return (
		<React.Fragment>

			{/* LHS */}

			{/* <Transition */}
			{/* 	unmountOnExit={false} */}
			{/* 	show={showSidebar} */}
			{/* 	enter="transition duration-500 ease-in-out" */}
			{/* 	enterFrom="transform -translate-x-80" */}
			{/* 	enterTo="transform translate-x-0" */}
			{/* 	leave="transition duration-500 ease-in-out" */}
			{/* 	leaveFrom="transform translate-x-0" */}
			{/* 	leaveTo="transform -translate-x-80" */}
			{/* > */}

			<TransitionV2
				on={showSidebar}
				transition="transition duration-500 ease-in-out"
				from="transform -translate-x-80"
				to="transform translate-x-0"
			>
				<div ref={scollingElementRef} className="pb-6 fixed left-0 inset-y-0 flex-none w-80 bg-cool-gray-100 overflow-y-scroll scrolling-touch z-10 cursor-pointer">

					<header
						// NOTE: Uses duration-300 not duration-150
						className="py-6 sticky top-0 inset-x-0 group bg-cool-gray-100 hover:bg-cool-gray-200 focus:bg-cool-gray-200 border-b-2 border-cool-gray-200 focus:outline-none transition duration-300 ease-in-out"
						style={{ borderColor: !scrollPercent && "transparent" }}
						onMouseEnter={() => setHoveredAccount(true)}
						onMouseLeave={() => setHoveredAccount(false)}
						tabIndex={0}
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
							<button className="mr-2 flex-none group inline-block focus:outline-none" onClick={() => setShowSidebar(!showSidebar)}>
								<svg className="w-5 h-5 text-transparent group-hover:text-cool-gray-400 group-focus:text-cool-gray-400 hover:text-cool-gray-500 focus:text-cool-gray-500 focus:outline-none transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									{/* <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /> */}
									<path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
								</svg>
							</button>
						</div>

						{/* NOTE: Uses mt-5 -mb-1 py-1 -- was mt-6 */}
						<div className="mt-5 -mb-1 px-4 py-1 flex flex-row items-center truncate">
							<div className="mr-3 relative flex-none">
								<img className="w-12 h-12 object-cover bg-cool-gray-200 rounded-full shadow-hero" src="https://pbs.twimg.com/profile_images/1217476210910994434/J1XO8K2n_400x400.jpg" alt="" />
								{/* <div className="absolute bottom-0 right-0"> */}
								{/* 	<div className="p-0.5 bg-tw-blue rounded-full shadow-hero"> */}
								{/* 		<SVG.TwitterLogo className="w-3 h-3 text-white transform scale-90" /> */}
								{/* 	</div> */}
								{/* </div> */}
							</div>
							<div className="truncate">
								<h2 className="flex flex-row items-center font-medium text-sm leading-6 text-cool-gray-600 group-hover:text-cool-gray-700 transition duration-150 ease-in-out">
									<span className="truncate">
										Russ Perry
									</span>{" "}
									<E className="ml-2">👾</E>{" "}
									<button className="ml-2 px-2.5 py-1 inline-block font-extrabold tracking-wider leading-none uppercase text-cool-gray-100 bg-cool-gray-800 rounded-full focus:outline-none focus:shadow-outline origin-left transform scale-90 transition duration-150 ease-in-out" style={{ fontSize: "0.625rem" }}>
										Upgrad<span className="tracking-normal">e</span>
									</button>
								</h2>
								<p className="font-medium text-sm leading-6 truncate text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out">
									<span className="truncate">
										{!hoveredAccount ? (
											"Front End Developer and Collector of Video Games"
										) : (
											"Open Settings"
										)}
									</span>
								</p>
							</div>
						</div>

					</header>

					{/* TODO: Add shortcuts */}
					<nav className="mt-6">
						<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									New Note
								</span>
							</p>
						</button>
						<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Open from Computer
								</span>
							</p>
						</button>
						<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
							<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
								<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M2 10a4 4 0 004 4h3v3a1 1 0 102 0v-3h3a4 4 0 000-8 4 4 0 00-8 0 4 4 0 00-4 4zm9 4H9V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 9.414V14z" clipRule="evenodd" />
								</svg>
								<span className="truncate">
									Open from URL
								</span>
							</p>
						</button>
					</nav>

					{/* <hr className="mt-6 border-t-2 border-cool-gray-200" /> */}

					<div className="mt-6">

						<nav className="my-2 mt-0">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
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
							<NoteItem>
								JavaScript in 2020
							</NoteItem>
							<NoteItem>
								Programming isn’t as hard as you think <E>😤</E>
							</NoteItem>
							<NoteItem>
								How to build a beautiful blog <E>👨🏻‍🍳</E>
							</NoteItem>
							<NoteItem>
								What I wish I’d known one year ago
							</NoteItem>
							<NoteItem>
								You don’t know what you don’t know
							</NoteItem>
							<NoteItem>
								What I learned from Carl Sagan <E>🚀</E>
							</NoteItem>
							<NoteItem>
								Why I love StarTalk <E>❤️</E>
							</NoteItem>
						</nav>

						<nav className="my-2">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
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
							<NoteItem>
								Why you should learn programming in 2020 <E>👨🏻‍🍳</E>
							</NoteItem>
							<NoteItem>
								Who really knows what programming is <E>🤔</E>
							</NoteItem>
							<NoteItem>
								The missing CSS property
							</NoteItem>
							<NoteItem>
								To build or not to build a blog <E>🚀</E>
							</NoteItem>
							<NoteItem>
								Surprise! You can now fund me on Patreon <E>❤️</E>
							</NoteItem>
						</nav>

						<nav className="my-2">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
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
										Empty
									</span>
								</p>
							</div>
						</nav>

						<nav className="my-2 mb-0">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
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
										Empty
									</span>
								</p>
							</div>
						</nav>

						<hr className="mt-6 border-t-2 border-cool-gray-200" />

						<nav className="mt-6">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
								<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
									<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd" />
									</svg>
									<span className="truncate">
										Getting Started
									</span>
								</p>
							</button>
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
								<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
									<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
									</svg>
									<span className="truncate">
										Changelog (Updated June 3, 2020)
									</span>
								</p>
							</button>
							<span className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out" tabIndex={0}>
								<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
									<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out"viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M13.5516 17.3702C13.5516 17.3702 13.2265 17.4601 12.9582 17.1855L12.9344 17.1592L6.67553 11.4759L4.00544 13.5006C3.59512 13.8399 3.31736 13.5416 3.31736 13.5416L2.14796 12.478C1.88914 12.1339 2.14796 11.9414 2.14796 11.9414L4.66648 9.65164L2.14795 7.36472C2.14795 7.36472 1.7692 7.0917 2.2237 6.72715L3.28262 5.78027C3.28262 5.78027 3.58562 5.46149 3.90598 5.73924L6.67778 7.8378L12.8225 2.24523C12.8752 2.21313 12.925 2.18853 12.9719 2.17045C12.8819 2.20244 12.8225 2.24522 12.8225 2.24522C12.8225 2.24522 13.2691 1.7481 13.9509 2.16947L17.0708 3.67344C17.0708 3.67344 17.5474 3.83441 17.5474 4.29996V14.8925C17.5474 14.8925 17.6121 15.2823 17.1513 15.5963L13.5516 17.3702ZM13.6778 16.6205V6.16616L9.09344 9.66672L13.6777 13.1375V16.6319C13.6778 16.6281 13.6778 16.6243 13.6778 16.6205Z" clipRule="evenodd" />
									</svg>
									<span className="truncate">
										VSCode Extension
									</span>{" "}
									<button className="ml-2 px-2.5 py-1 inline-block font-extrabold tracking-wider leading-none uppercase text-cool-gray-100 bg-cool-gray-800 rounded-full focus:outline-none focus:shadow-outline origin-left transform scale-90 transition duration-150 ease-in-out" style={{ fontSize: "0.625rem" }}>
										Downloa<span className="tracking-normal">d</span>
									</button>
								</p>
							</span>
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
								<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
									<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
									</svg>
									<span className="truncate">
										Support
									</span>
								</p>
							</button>
							{/* <button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out"> */}
							{/* 	<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out"> */}
							{/* 		<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" fill="currentColor" viewBox="0 0 20 20"> */}
							{/* 			<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /> */}
							{/* 		</svg> */}
							{/* 		<span className="truncate"> */}
							{/* 			Feedback */}
							{/* 		</span> */}
							{/* 	</p> */}
							{/* </button> */}
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
								<p className="flex flex-row items-center font-medium text-sm leading-5 text-cool-gray-500 group-hover:text-cool-gray-600 group-focus:text-cool-gray-600 transition duration-150 ease-in-out">
									<svg className="mr-2 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transition duration-150 ease-in-out" style={{ transform: "scale(0.8125)" }} fill="currentColor" viewBox="0 0 16 16">
										<path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
									</svg>
									<span className="truncate">
										Open Source
									</span>{" "}
									<svg className="ml-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500 transform scale-90 transition duration-150 ease-in-out" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
										<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</p>
							</button>
						</nav>

						<hr className="mt-6 border-t-2 border-cool-gray-200" />

						<nav className="mt-6">
							<button className="px-4 py-1.5 group inline-block w-full hover:bg-cool-gray-200 focus:bg-cool-gray-200 focus:outline-none transition duration-150 ease-in-out">
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

				</div>
			</TransitionV2>

			{/* RHS */}
			<div className="ml-0 lg:ml-80 px-6 py-24 flex-1">
				{/* ... */}

				<Dialog />
			</div>

		</React.Fragment>
	)
}

// FIXME: border-t and border-b
const Dialog = () => {
	const ref = React.useRef()

	const [open, setOpen] = React.useState(false)

	const [offsetHeight, setOffsetHeight] = React.useState(0)
	const [scrollHeight, setScrollHeight] = React.useState(0)

	React.useLayoutEffect(() => {
		setOffsetHeight(ref.current.children[0].offsetHeight)
		setScrollHeight(ref.current.scrollHeight)
	}, [open])

	return (
		<div ref={ref} style={{ height: !open ? offsetHeight : scrollHeight, overflowY: "hidden", transition: "height 250ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
			<button className="px-2 py-4 inline-block w-full bg-green-100" onClick={() => setOpen(!open)}>
				<p className="flex flex-row items-center">
					<TransitionV2
						on={open}
						transition="transition duration-150 ease-in-out"
						from="transform rotate-0"
						to="transform rotate-90"
					>
						<svg className="mr-1 flex-none w-5 h-5 text-cool-gray-400 group-hover:text-cool-gray-500 group-focus:text-cool-gray-500" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
						</svg>
					</TransitionV2>{" "}
					hello
				</p>
			</button>
			{/* <div style={{ visibility: !open && "hidden" }}> */}
			<button className="px-2 py-4 inline-block w-full bg-gray-100" onClick={e => e.stopPropagation()} tabIndex={!open ? -1 : undefined}>
				hello
			</button>
			<button className="px-2 py-4 inline-block w-full bg-gray-100" onClick={e => e.stopPropagation()} tabIndex={!open ? -1 : undefined}>
				hello
			</button>
			<button className="px-2 py-4 inline-block w-full bg-gray-100" onClick={e => e.stopPropagation()} tabIndex={!open ? -1 : undefined}>
				hello
			</button>
			<button className="px-2 py-4 inline-block w-full bg-gray-100" onClick={e => e.stopPropagation()} tabIndex={!open ? -1 : undefined}>
				hello
			</button>
			{/* </div> */}
		</div>
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
