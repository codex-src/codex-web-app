import CodexBadge from "components/CodexBadge"
import React from "react"

// https://images.unsplash.com/photo-1552072232-059f1a5d76c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2900&q=80
const SignUp = () => (
	<div className="flex flex-row h-full">
		<div className="hidden md:block w-full bg-gray-100">
			todo
		</div>
		<div className="px-24 py-48 flex-shrink-0 w-full max-w-xl">
			<div style={{ fontSize: "75%" }}>
				<CodexBadge />
			</div>
			<h2 className="font-semibold text-3xl md:text-4xl Poppins text-gray-900">
				Welcome to Codex
			</h2>
			<div>hello</div>
			<div>hello</div>
			<div>hello</div>
			<div>hello</div>
			<div>hello</div>
		</div>
	</div>
)

export default SignUp
