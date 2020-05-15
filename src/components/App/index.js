import AppContainer from "components/AppContainer"
import FAQ from "components/FAQ"
import Footer from "components/Footer"
import Nav from "components/Nav"
import React from "react"
import paths from "paths"

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
			<React.Fragment>
				<AppContainer>
					<Nav />
				</AppContainer>

				<div className="h-full" />

				<FAQ />

				<Footer />
			</React.Fragment>

			<Route path={paths.blog}>
				blog
			</Route>
			<Route path={paths.continue}>
				continue
			</Route>
			<Route path={paths.demo}>
				demo
			</Route>
			<Route path={paths.home}>
				home
			</Route>
			<Route path={paths.pricing}>
				pricing
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
