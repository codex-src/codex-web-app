import Nav from "components/Nav"
import React from "react"

export const App = props => (
	<React.Fragment>
		<Nav />
		<div className="py-40 flex flex-row justify-center min-h-full">
			<div className="px-6 w-full max-w-screen-lg">
				{props.children}
			</div>
		</div>
	</React.Fragment>
)

export const Note = props => (
	<React.Fragment>
		<Nav />
		<div className="py-40 flex flex-row justify-center">
			<div className="px-6 w-full max-w-screen-md">
				{props.children}
			</div>
		</div>
	</React.Fragment>
)
