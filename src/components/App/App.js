import * as AuthRoute from "components/AuthRoute"
import * as Router from "react-router-dom"
import Auth from "components/Auth"
import Demo from "components/Demo"
import Home from "components/Home"
import React from "react"

const App = props => (
	<Router.BrowserRouter>
		<Router.Switch>

			<AuthRoute.Unprotected
				path="/"
				exact
				title=""
				children={<Home />}
			/>
			<AuthRoute.Unprotected
				path="/auth"
				title="Open your Codex"
				children={<Auth />}
			/>
			<AuthRoute.Unprotected
				path="/demo"
				exact
				title="Demo"
				children={<Demo />}
			/>

			{/* <AuthRoute.Unprotected */}
			{/* 	path="/our-story" */}
			{/* 	exact */}
			{/* 	title="Our story" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
			{/* 	path="/features" */}
			{/* 	exact */}
			{/* 	title="Features" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
			{/* 	path="/pricing" */}
			{/* 	exact */}
			{/* 	title="Pricing" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
			{/* 	path="/faq" */}
			{/* 	exact */}
			{/* 	title="FAQ" */}
			{/* 	component={props => "TODO"} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
			{/* 	path="/sign-up" */}
			{/* 	exact */}
			{/* 	title="Sign up" */}
			{/* 	component={Forms.SignUpFlow} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
			{/* 	path="/sign-in" */}
			{/* 	exact */}
			{/* 	title="Sign in" */}
			{/* 	component={Forms.SignIn} */}
			{/* /> */}
			{/* <AuthRoute.Unprotected */}
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

		</Router.Switch>
	</Router.BrowserRouter>
)

export default App
