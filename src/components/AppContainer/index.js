import React from "react"

const AppContainer = ({ children }) => (
	<div className="px-6 flex flex-row justify-center">
		<div className="w-full max-w-6xl">
			{children}
		</div>
	</div>
)

export default AppContainer
