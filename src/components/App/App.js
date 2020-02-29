// import * as ProgressBar from "components/ProgressBar"
import * as constants from "__constants"
import * as random from "utils/random"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Auth from "components/Auth"
import Demo from "components/Demo"
import Home from "components/Home"
import React from "react"

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			{/* <ProgressBar.Provider> */}
				{/* <ProgressBar.ProgressBar /> */}
				<Router.Switch>

					<User.UnprotectedRoute
						path={constants.PATH_AUTH}
						title="Open your Codex"
						children={<Auth />}
					/>
					<User.UnprotectedRoute
						path={constants.PATH_DEMO}
						exact
						title="Demo"
						children={<Demo />}
					/>

					{/* NOTE: PATH_HOME cannot share the same route */}
					<User.Context.Consumer>
						{user => !user ? (
							// Unauthenticated users:
							<User.UnprotectedRoute path={constants.PATH_HOME} exact>
								<Home key={random.newFourByteHash()} />
							</User.UnprotectedRoute>
						) : (
							// Authenticated users:
							<User.ProtectedRoute path={constants.PATH_HOME} exact>
								<Home key={random.newFourByteHash()} />
							</User.ProtectedRoute>
						)}
					</User.Context.Consumer>

				</Router.Switch>
			{/* </ProgressBar.Provider> */}
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
