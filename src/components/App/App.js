import Auth from "components/Auth"
import Demo from "components/Demo"
import Marketing from "components/Marketing"
import React from "react"

import {
	// Protected,
	Unprotected,
} from "components/AuthRoute"

import {
	BrowserRouter,
	Switch,
} from "react-router-dom"

const App = props => (
	<BrowserRouter>
		<Switch>

			<Unprotected
				path="/"
				exact
				title=""
				children={<Marketing />}
			/>
			<Unprotected
				path="/auth"
				title="Open your Codex"
				children={<Auth />}
			/>
			<Unprotected
				path="/demo"
				exact
				title="Demo"
				children={<Demo />}
			/>

			{/* <Unprotected */}
			{/* 	path="/our-story" */}
			{/* 	exact */}
			{/* 	title="Our story" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/features" */}
			{/* 	exact */}
			{/* 	title="Features" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/pricing" */}
			{/* 	exact */}
			{/* 	title="Pricing" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/faq" */}
			{/* 	exact */}
			{/* 	title="FAQ" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/sign-up" */}
			{/* 	exact */}
			{/* 	title="Sign up" */}
			{/* 	component={Forms.SignUpFlow} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/sign-in" */}
			{/* 	exact */}
			{/* 	title="Sign in" */}
			{/* 	component={Forms.SignIn} */}
			{/* /> */}
			{/* <Unprotected */}
			{/* 	path="/reset-password" */}
			{/* 	exact */}
			{/* 	title="Reset password" */}
			{/* 	component={Forms.ResetPassword} */}
			{/* /> */}

			{/* <Protected */}
			{/* 	path="/new" */}
			{/* 	exact */}
			{/* 	title="New note" */}
			{/* 	render={props => <Note key={newFourByteHash()} />} */}
			{/* /> */}

		</Switch>
	</BrowserRouter>
)

export default App
