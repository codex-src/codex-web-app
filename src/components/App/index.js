import * as paths from "paths"
import HomePage from "pages/HomePage"
import PricingPage from "pages/PricingPage"
import React from "react"
import SignInPage from "pages/SignInPage"
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

			<Route path={paths.BLOG}>
				{/* TODO */}
			</Route>
			<Route path={paths.DEMO}>
				{/* TODO */}
			</Route>
			<Route path={paths.PRICING}>
				<PricingPage />
			</Route>
			<Route path={paths.SIGN_IN}>
				<SignInPage />
			</Route>
			<Route path={paths.SIGN_UP}>
				<SignUpPage />
			</Route>

			<Route path={paths.HOME}>
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
