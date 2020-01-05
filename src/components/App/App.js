import * as Router from "react-router-dom"
import DebugCSS from "components/DebugCSS"
import fetchGraphQL from "./fetchGraphQL"
import Footer from "components/Footer"
import Forms from "components/Forms"
import GraphQL from "use-graphql"
import id from "lib/random/id"
import Nav from "components/Nav"
import Note from "components/Note"
import PageNotFound from "./PageNotFound"
import React from "react"
import stylex from "stylex"
import User from "components/User"

const AppContainer = props => (
	<DebugCSS>
		<div style={stylex.parse("flex -c -y:between h:max")}>
			<div style={stylex.parse("b:white")}>
				<Nav />
				<main style={stylex.parse("p-x:24 p-y:80 flex -r -x:center")}>
					<div style={stylex.parse("w:1024 no-min-w")}>
						{props.children}
					</div>
				</main>
			</div>
			<Footer />
		</div>
	</DebugCSS>
)

const client = new GraphQL.Client({ fetchGraphQL })

const AppProviders = props => (
	<GraphQL.Provider client={client}>
		<User.Provider>
			{props.children}
		</User.Provider>
	</GraphQL.Provider>
)

// TODO: Add home route.
const App = props => (
	<Router.BrowserRouter>
		<AppProviders>
			<AppContainer>
				<Router.Switch>

					{/* Unprotected routes: */}
					<User.UnprotectedRoute
						path="/our-story"
						exact
						title={"Our story"}
						component={props => "TODO"}
					/>
					<User.UnprotectedRoute
						path="/features"
						exact
						title={"Features"}
						component={props => "TODO"}
					/>
					<User.UnprotectedRoute
						path="/pricing"
						exact
						title={"Pricing"}
						component={props => "TODO"}
					/>
					<User.UnprotectedRoute
						path="/faq"
						exact
						title={"FAQ"}
						component={props => "TODO"}
					/>
					<User.UnprotectedRoute
						path="/sign-up"
						exact
						title={"Sign up"}
						component={Forms.SignUpFlow}
					/>
					<User.UnprotectedRoute
						path="/sign-in"
						exact
						title={"Sign in"}
						component={Forms.SignIn}
					/>
					<User.UnprotectedRoute
						path="/reset-password"
						exact
						title={"Reset password"}
						component={Forms.ResetPassword}
					/>

					{/* Protected routes: */}
					<User.ProtectedRoute
						path="/new"
						exact
						title={"New note"}
						render={props => <Note key={id.newFourByteHash()} />}
					/>

					<User.Route
						path="/"
						title={"404"}
						component={PageNotFound}
					/>

				</Router.Switch>
			</AppContainer>
		</AppProviders>
	</Router.BrowserRouter>
)

export default App
