import fetchGraphQL from "./fetchGraphQL"
import Footer from "components/Footer"
import GraphQL from "use-graphql"
import Nav from "components/Nav"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"
import User from "components/User"

const client = new GraphQL.Client({
	fetchGraphQL,
})

const App = props => (
	<Router.BrowserRouter>
		<GraphQL.Provider client={client}>
			<User.Provider>
				<div style={stylex("flex -c -y:between h:max")}>
					<div>
						<Nav />
						<main style={stylex("pre-wrap")}>
							{`hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
hello
`}
						</main>
					</div>
					<Footer />
				</div>
			</User.Provider>
		</GraphQL.Provider>
	</Router.BrowserRouter>
)

export default App
