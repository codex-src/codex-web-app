import * as constants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as Route from "components/Route"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Auth from "components/Auth"
import Changelog from "components/Changelog"
import Demo from "components/Demo"
import Home from "components/Home"
import KnownIssues from "components/KnownIssues"
import ReadOnlyNote from "components/ReadOnlyNote"
import React from "react"
import UserNote from "components/UserNote"
import UserNotes from "components/UserNotes"

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			<ProgressBar.Provider>
				<ProgressBar.ProgressBar />
				<Router.Switch>

					{/* Changelog */}
					<Route.Route
						path={constants.PATH_CHANGELOG}
						title="Changelog"
						exact
						children={<Changelog />}
					/>
					{/* Known issues */}
					<Route.Route
						path={constants.PATH_KNOWN_ISSUES}
						title="Known issues"
						exact
						children={<KnownIssues />}
					/>
					{/* Note */}
					<Route.Route path={constants.PATH_NOTE} exact>
						<User.Context.Consumer>
							{user => !user ? (
								<ReadOnlyNote />
							) : (
								<UserNote />
							)}
						</User.Context.Consumer>
					</Route.Route>
					{/* Home */}
					<Route.Route path={constants.PATH_HOME} exact>
						<User.Context.Consumer>
							{user => !user ? (
								<Home />
							) : (
								<UserNotes />
							)}
						</User.Context.Consumer>
					</Route.Route>

					{/* Auth */}
					<Route.Unprotected
						path={constants.PATH_AUTH}
						title="Open your Codex"
						children={<Auth />}
					/>
					{/* Demo */}
					<Route.Unprotected
						path={constants.PATH_DEMO}
						exact
						title="Demo"
						children={<Demo />}
					/>

					{/* Protected */}
					<Route.Protected
						path={constants.PATH_NEW_NOTE}
						title="New note"
						children={<UserNote />}
					/>
					<Route.Protected
						path={constants.PATH_NOTE}
						title="Editing note"
						children={<UserNote />}
					/>

				</Router.Switch>
			</ProgressBar.Provider>
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
