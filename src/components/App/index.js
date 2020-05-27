import Home from "pages/Home"
import paths from "paths"
import Pricing from "pages/Pricing"
import React from "react"

import {
	BrowserRouter,
	Route,
	Switch,
} from "react-router-dom"

// document.body.classList.toggle("debug-css")

const App = () => (
	<BrowserRouter>
		<Switch>

			{/* TODO: Extract to <UnauthHome> */}

			<Route path={paths.blog}>
				blog
			</Route>
			<Route path={paths.continue}>
				continue
			</Route>
			<Route path={paths.demo}>
				demo
			</Route>
			<Route path={paths.pricing}>
				<Pricing />
			</Route>

			<Route path={paths.home}>
				<Home />
			</Route>

			{/* <Route */}
			{/* 	path={constants.PATH_README} */}
			{/* 	title="Readme" */}
			{/* 	exact */}
			{/* 	// NOTE: Use key because <Note> is shared */}
			{/* 	children={<Note key={random.newFourByteHash()} noteID={constants.NOTE_ID_README} />} */}
			{/* /> */}

		</Switch>
	</BrowserRouter>
)

export default App
