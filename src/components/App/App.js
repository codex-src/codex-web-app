import * as Router from "react-router-dom"
import * as User from "components/User"
import Auth from "components/Auth"
import Demo from "components/Demo"
import Home from "components/Home"
import React from "react"

// const Providers = props => (
// 	<Router.BrowserRouter>
// 		<User.Provider>
// 			{props.children}
// 		</User.Provider>
// 	</Router.BrowserRouter>
// )

// {/* NOTE: An unauthenticated and authenticated
// route cannot share the same path. */}
// <User.Context.Consumer>
// 	{([state]) => !state.auth ? (
// 		<Routes.Route
// 			path="/"
// 			exact
// 			title={CodexTitle("Home")}
// 			component={props => "TODO"}
// 		/>
// 	) : (
// 		null
// 		// <Routes.Route
// 		// 	path="/"
// 		// 	exact
// 		// 	title={CodexTitle("Notes")}
// 		// 	component={Notes}
// 		// />
// 	)}
// </User.Context.Consumer>

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			<Router.Switch>

				<User.UnprotectedRoute
					path="/"
					exact
					title=""
					children={<Home />}
				/>
				<User.UnprotectedRoute
					path="/auth"
					title="Open your Codex"
					children={<Auth />}
				/>
				<User.UnprotectedRoute
					path="/demo"
					exact
					title="Demo"
					children={<Demo />}
				/>

				{/* <User.ProtectedRoute */}
				{/* 	path="/" */}
				{/* 	exact */}
				{/* 	title="New note" */}
				{/* 	render={props => <Note key={newFourByteHash()} />} */}
				{/* /> */}

				{/* <User.UnprotectedRoute */}
				{/* 	path="/our-story" */}
				{/* 	exact */}
				{/* 	title="Our story" */}
				{/* 	component={props => "TODO"} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/features" */}
				{/* 	exact */}
				{/* 	title="Features" */}
				{/* 	component={props => "TODO"} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/pricing" */}
				{/* 	exact */}
				{/* 	title="Pricing" */}
				{/* 	component={props => "TODO"} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/faq" */}
				{/* 	exact */}
				{/* 	title="FAQ" */}
				{/* 	component={props => "TODO"} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/sign-up" */}
				{/* 	exact */}
				{/* 	title="Sign up" */}
				{/* 	component={Forms.SignUpFlow} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/sign-in" */}
				{/* 	exact */}
				{/* 	title="Sign in" */}
				{/* 	component={Forms.SignIn} */}
				{/* /> */}
				{/* <User.UnprotectedRoute */}
				{/* 	path="/reset-password" */}
				{/* 	exact */}
				{/* 	title="Reset password" */}
				{/* 	component={Forms.ResetPassword} */}
				{/* /> */}

			</Router.Switch>
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
