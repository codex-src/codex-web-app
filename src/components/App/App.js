// import * as ProgressBar from "components/ProgressBar"
import * as constants from "__constants"
import * as random from "utils/random"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Demo from "components/Demo"
import Homepage from "components/Homepage"
import React from "react"
import UserAuth from "components/UserAuth"
import UserNotes from "components/UserNotes"

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			{/* <ProgressBar.Provider> */}
				{/* <ProgressBar.ProgressBar /> */}
				<Router.Switch>

					<User.UnprotectedRoute
						path={constants.PATH_AUTH}
						title="Open your Codex"
						children={<UserAuth />}
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
							// Unauthenticated:
							<User.UnprotectedRoute path={constants.PATH_HOME} exact>
								<Homepage key={random.newFourByteHash()} />
							</User.UnprotectedRoute>
						) : (
							// Authenticated:
							<User.ProtectedRoute path={constants.PATH_HOME} exact>
								<UserNotes key={random.newFourByteHash()} />
							</User.ProtectedRoute>
						)}
					</User.Context.Consumer>

				</Router.Switch>
			{/* </ProgressBar.Provider> */}
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
