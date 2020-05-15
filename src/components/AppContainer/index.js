import React from "react"

// Contains the app for most use cases.
const AppContainer = ({ children }) => (
	<div className="px-6 flex flex-row justify-center">
		<div className="w-full max-w-5xl">
			{children}
		</div>
	</div>
)

export default AppContainer
