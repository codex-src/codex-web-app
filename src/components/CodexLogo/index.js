import React from "react"

// Renders the Codex logo.
//
// https://codepen.io/zaydek/pen/rNOZNwZ
const CodexLogo = () => (
	<div className="em-context flex flex-row items-center select-none">
		<svg
			className="w-16 h-16 text-md-blue-a400"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			// strokeWidth="2"
			strokeWidth="1.75"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
		</svg>
		<div className="w-2"></div>
		<div className="-mt-2">
			<h1
				className="text-6xl leading-none Poppins lowercase text-black"
				style={{
					clipPath: "inset(18.75% 0 0 0)",
					letterSpacing: "-0.025em",
				}}
			>
				Codex
			</h1>
		</div>
	</div>
)

export default CodexLogo
