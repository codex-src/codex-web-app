import Footer from "components/Footer"
import Nav from "components/Nav"
import React from "react"
import Router from "components/Router"
import stylex from "stylex"

const App = props => (
	<Router.BrowserRouter>
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
	</Router.BrowserRouter>
)

export default App
