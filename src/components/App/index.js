import fetchGraphQL from "./fetchGraphQL"
import Footer from "components/Footer"
import GraphQL from "use-graphql"
import Nav from "components/Nav"
import PageNotFound from "./PageNotFound"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

const client = new GraphQL.Client({
	fetchGraphQL,
})

const Providers = props => (
	<Router.BrowserRouter>
		<GraphQL.Provider client={client}>
			<User.Provider>
				{props.children}
			</User.Provider>
		</GraphQL.Provider>
	</Router.BrowserRouter>
)

const Codex = title => `${title} - Codex`

const App = props => (
	<Providers>
		<div style={stylex("flex -c -y:between h:max")}>
			<div>
				<Nav />
				<main style={stylex("p-x:32 p-y:96 flex -r -x:center")}>
					<div style={stylex("w:1024")}>
						<Router.Switch>

							{/* Unprotected: */}
							<User.UnprotectedRoute
								path="/our-story"
								exact
								title={Codex("Our story")}
								component={props => "TODO"}
							/>
							<User.UnprotectedRoute
								path="/features"
								exact
								title={Codex("Features")}
								component={props => "TODO"}
							/>
							<User.UnprotectedRoute
								path="/pricing"
								exact
								title={Codex("Pricing")}
								component={props => "TODO"}
							/>
							<User.UnprotectedRoute
								path="/faq"
								exact
								title={Codex("FAQ")}
								component={props => "TODO"}
							/>
							<User.UnprotectedRoute
								path="/sign-in"
								exact
								title={Codex("Sign in")}
								component={props => "TODO"}
							/>
							<User.UnprotectedRoute
								path="/sign-up"
								exact
								title={Codex("Sign up")}
								component={props => "TODO"}
							/>

							<User.Route
								path="/"
								title={Codex("404")}
								component={PageNotFound}
							/>

						</Router.Switch>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	</Providers>
)

export default App
