// import Nav from "components/Nav"
import Editor from "components/Editor"
import Emoji from "utils/Emoji"
import Link from "utils/RouterLink"
import raw from "raw.macro"
import React from "react"
import { ReactComponent as CodexLogo } from "assets/codex.svg"

import "./Marketing.css"

const Nav = props => (
	<nav className="px-6 absolute inset-x-0 top-0 flex justify-center h-20 bg-white z-30">
		<div className="flex justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<Link to="/" className="flex items-center h-full hover:text-brand transition duration-75 ease-in-out">
				<CodexLogo style={{ width: "5.625rem", height: "3.75rem" }} />
			</Link>

			{/* RHS: */}
			<div className="flex items-center h-full">
				{/* <Link */}
				{/* 	to="#features" */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	children="Features" */}
				{/* /> */}
				{/* <Link */}
				{/* 	to="#pricing" */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	children="Pricing" */}
				{/* /> */}
				{/* <Link */}
				{/* 	to="/sign-in" */}
				{/* 	className="px-2 flex items-center h-full text-gray-900 hover:text-brand transition duration-75 ease-in-out" */}
				{/* 	children="Login" */}
				{/* /> */}
				{/* CTA: */}
				<Link
					to="/demo"
					className="-mr-4 px-4 flex items-center h-full"
				>
					<div className="px-3 py-2 text-brand border border-brand rounded-sm">
						<p className="font-medium">
							Try the editor alpha
						</p>
					</div>
				</Link>
			</div>
		</div>
	</nav>
)

const Markdown = props => (
	<span className="markdown">
		{props.children}
	</span>
)

// # Codex is a new notebook for devs. ✍️ Based on **markdown** and works _everywhere_
//
// <Markdown>#</Markdown> Codex is a new notebook for devs. <Emoji emoji="✍️" />{" "}
// Based on {/* <strong> */}<Markdown>**</Markdown>markdown<Markdown>**</Markdown>{/* </strong> */} and works <em><Markdown>_</Markdown>everywhere<Markdown>_</Markdown></em>

// # Codex is a new notebook for devs. ✍️ Based on **markdown** and works _everywhere_
// # Codex makes it easier than ever to express yourself in words and code

const Hero = props => (
	<section className="px-6 py-32 flex justify-center items-center min-h-screen">
		<div className="flex lg:flex-row flex-col items-center w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="w-full flex lg:block flex-col md:items-start items-center">
				<h1 className="font-bold text-4xl">
					{/* <Markdown>#</Markdown> */}
					Codex makes it easier than ever to express yourself in words <em>and</em> code
				</h1>
				{/* <div className="h-4" /> */}
				{/* <p className="text-2xl text-gray-700"> */}
				{/* 	Codex makes it easier than ever to express yourself in words <em>and</em> code. */}
				{/* </p> */}
				<div className="h-8" />
				<Link
					to="/demo"
					className="py-1 block"
				>
					<p className="font-medium text-2xl text-brand">
						Try the editor alpha!
					</p>
				</Link>
				<Link
					to="#features"
					className="py-1 block"
				>
					<p className="font-medium text-2xl text-brand">
						Learn more
					</p>
				</Link>
			</div>

			{/* Spacer: */}
			<div className="w-24 h-12" />

			{/* RHS: */}
			<div className="w-full">
				<MarketingEditor />
			</div>

		</div>
	</section>
)

// TODO: Show markdown background
function MarketingEditor(props) {
	const [state, dispatch] = Editor.useEditor(raw("./Marketing.md"))

	return (
		// Preserve aspect ratio:
		<div id="marketing-editor" className="pb-4/5 relative">
			<div className="absolute inset-0">
				{/* Two shadows: */}
				<div className="h-full rounded-xl shadow-xs">
					<div className="px-6 py-4 h-full bg-white rounded-xl shadow-xl overflow-y-scroll scrolling-touch">
						<Editor.Editor
							state={state}
							dispatch={dispatch}
							statusBars={false}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

// function FullscreenEditor(props) {
// 	const [state, dispatch] = Editor.useEditor("# Hello, world!")
//
// 	return (
// 		// Preserve aspect ratio:
// 		<div className="pb-9/16 relative">
// 			<div className="absolute inset-0">
// 				{/* Two shadows: */}
// 				<div className="h-full rounded-xl shadow-xs">
// 					<div className="px-6 py-4 h-full bg-white rounded-xl shadow-xl overflow-y-scroll scrolling-touch">
// 						<Editor.Editor
// 							state={state}
// 							dispatch={dispatch}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

const Home = props => (
	<div className="!debug-css">
		<Nav />

		<Hero />

		{/* <div className="bg-gray-100"> */}
		{/* 	<section className="px-6 py-32 min-h-screen bg-gray-100"> */}
		{/* 		<FullscreenEditor /> */}
		{/* 	</section> */}
		{/* </div> */}

		{/* <div className="h-screen bg-gray-100"></div> */}
		{/* <div className="h-screen"></div> */}
		{/* <div className="h-screen bg-gray-100"></div> */}
	</div>
)

export default Home
