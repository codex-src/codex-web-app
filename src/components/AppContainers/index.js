import React from "react"

export const AppContainer = ({ children }) => (
	<div className="px-6 flex flex-row justify-center">
		<div className="w-full max-w-5xl">
			{children}
		</div>
	</div>
)

export const WideAppContainer = ({ children }) => (
	<div className="px-6 flex flex-row justify-center">
		<div className="w-full max-w-6xl">
			{children}
		</div>
	</div>
)
