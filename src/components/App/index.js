import HomePage from "pages/HomePage"
import paths from "paths"
import PricingPage from "pages/PricingPage"
import React from "react"
import SignUpPage from "pages/SignUpPage"

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
				{/* TODO */}
			</Route>
			<Route path={paths.continue}>
				{/* TODO */}
			</Route>
			<Route path={paths.demo}>
				{/* TODO */}
			</Route>
			<Route path={paths.pricing}>
				<PricingPage />
			</Route>
			<Route path={paths.signUp}>
				<SignUpPage />
			</Route>

			<Route path={paths.home}>
				<HomePage />
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
