// import Note from "components/Note"
// import { newFourByteHash } from "utils/random"
import Demo from "components/Demo"
import Marketing from "components/Marketing"
import React from "react"

import {
	// ProtectedRoute,
	UnprotectedRoute,
} from "components/User"

import {
	BrowserRouter,
	Switch,
} from "react-router-dom"

const App = props => (
	<BrowserRouter>
		<Switch>

			<UnprotectedRoute
				path="/"
				exact
				title=""
				children={<Marketing />}
			/>
			<UnprotectedRoute
				path="/demo"
				exact
				title="Demo"
				children={<Demo />}
			/>

			{/* <UnprotectedRoute */}
			{/* 	path="/our-story" */}
			{/* 	exact */}
			{/* 	title="Our story" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/features" */}
			{/* 	exact */}
			{/* 	title="Features" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/pricing" */}
			{/* 	exact */}
			{/* 	title="Pricing" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/faq" */}
			{/* 	exact */}
			{/* 	title="FAQ" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/sign-up" */}
			{/* 	exact */}
			{/* 	title="Sign up" */}
			{/* 	component={Forms.SignUpFlow} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/sign-in" */}
			{/* 	exact */}
			{/* 	title="Sign in" */}
			{/* 	component={Forms.SignIn} */}
			{/* /> */}
			{/* <UnprotectedRoute */}
			{/* 	path="/reset-password" */}
			{/* 	exact */}
			{/* 	title="Reset password" */}
			{/* 	component={Forms.ResetPassword} */}
			{/* /> */}

			{/* <ProtectedRoute */}
			{/* 	path="/new" */}
			{/* 	exact */}
			{/* 	title="New note" */}
			{/* 	render={props => <Note key={newFourByteHash()} />} */}
			{/* /> */}

		</Switch>
	</BrowserRouter>
)

export default App
