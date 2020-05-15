import Nav from "components/Nav"
import React from "react"
import { BrowserRouter } from "react-router-dom"

// document.body.classList.toggle("debug-css")

const App = () => (
	<BrowserRouter>
		<div className="px-6 flex flex-row justify-center">
			<div className="w-full max-w-5xl">
				<Nav />

			</div>
		</div>
	</BrowserRouter>
)

export default App
