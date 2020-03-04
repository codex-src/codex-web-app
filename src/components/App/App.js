// import * as ProgressBar from "components/ProgressBar"
import * as constants from "__constants"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Auth from "components/Auth"
import Demo from "components/Demo"
import Home from "components/Home"
import React from "react"
import UserNotes from "components/UserNotes"

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			{/* <ProgressBar.Provider> */}
			{/* <ProgressBar.ProgressBar /> */}
			<Router.Switch>

				{/* Auth */}
				<User.UnprotectedRoute
					path={constants.PATH_AUTH}
					title="Open your Codex"
					children={<Auth />}
				/>

				{/* Demo */}
				<User.UnprotectedRoute
					path={constants.PATH_DEMO}
					exact
					title="Demo"
					children={<Demo />}
				/>

				{/* Home */}
				<User.Context.Consumer>
					{user => !user ? (
						<User.UnprotectedRoute path={constants.PATH_HOME} exact>
							<Home /* key={random.newFourByteHash()} */ />
						</User.UnprotectedRoute>
					) : (
						<User.ProtectedRoute path={constants.PATH_HOME} exact>
							<UserNotes /* key={random.newFourByteHash()} */ />
						</User.ProtectedRoute>
					)}
				</User.Context.Consumer>

			</Router.Switch>
			{/* </ProgressBar.Provider> */}
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
