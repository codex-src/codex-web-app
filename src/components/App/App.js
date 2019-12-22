import fetchGraphQL from "./fetchGraphQL"
import Footer from "components/Footer"
import Forms from "components/Forms"
import GraphQL from "use-graphql"
import Nav from "components/Nav"
import Note from "components/Note"
import PageNotFound from "./PageNotFound"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

// TODO: Add home route.
const App = props => (
	<Router.BrowserRouter>
		<GraphQL.Provider client={new GraphQL.Client({ fetchGraphQL })}>
			<User.Provider>

				<div style={stylex.parse("flex -c -y:between h:max")}>
					<div>
						<Nav />
						<main style={stylex.parse("p-x:32 p-y:96 flex -r -x:center")}>
							<div style={stylex.parse("w:1024 no-min-w")}>
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
										// Use `render` instead of component
										// because of `key`.
										render={props => <Note key={Math.random().toString(16).slice(2, 6)} />}
									/>

									<User.Route
										path="/"
										title={"404"}
										component={PageNotFound}
									/>

								</Router.Switch>
							</div>
						</main>
					</div>
					<Footer />
				</div>

			</User.Provider>
		</GraphQL.Provider>
	</Router.BrowserRouter>
)

export default App
