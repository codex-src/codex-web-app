import React from "react"

const Container = props => (
	<div className="px-6 py-40 flex flex-row justify-center min-h-full">
		{props.children}
	</div>
)

export default Container
