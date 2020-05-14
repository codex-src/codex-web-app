import React from "react"

// Renders the Codex logo.
//
// https://codepen.io/zaydek/pen/rNOZNwZ
const CodexLogo = ({ sizeLarge } = { sizeLarge: false }) => (
	<div className="em-context flex flex-row items-center select-none">
		<svg
			className="w-16 h-16 text-md-blue-a400 dark:text-md-blue-a200 transform scale-90"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={!sizeLarge ? "2" : "1.75"}
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
		</svg>
		<div className="w-1"></div>
		<div className="-mt-2">
			<h1
				// NOTE: Uses Poppins as a dependency
				className="Poppins text-6xl leading-none lowercase text-black dark:text-white"
				style={{
					clipPath: "inset(18.75% 0 0 0)",
					letterSpacing: "-0.025em",
					fontWeight: !sizeLarge ? 500 : 400,
				}}
			>
				Codex
			</h1>
		</div>
	</div>
)

// Renders the thicker Codex logo, which more suitable for
// small sizes.
export const CodexLogoSm = () => (
	<CodexLogo />
)

// Renders the thinner Codex logo, which more suitable for
// large sizes.
export const CodexLogoLg = () => (
	<CodexLogo sizeLarge />
)
