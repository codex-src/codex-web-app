import * as constants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as Route from "components/Route"
import * as Router from "react-router-dom"
import * as User from "components/User"
import Auth from "components/Auth"
import Demo from "components/Demo"
import Home from "components/Home"
import Nav from "components/Nav"
import Note from "components/Note"
import NoteContainer from "components/NoteContainer"
import React from "react"
import UserNote from "components/UserNote"
import UserNotes from "components/UserNotes"

// const ReadOnlyNote = props => {
// 	const { noteID } = Router.useParams()
//
// 	return <Note noteID={noteID} />
// }

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			<ProgressBar.Provider>
				<ProgressBar.ProgressBar />
				<Router.Switch>

					{/* Readme */}
					<Route.Route
						path={constants.PATH_README}
						title="Readme"
						exact
						children={<Note noteID={constants.NOTE_ID_README} />}
					/>
					{/* Changelog */}
					<Route.Route
						path={constants.PATH_CHANGELOG}
						title="Changelog"
						exact
						children={<Note noteID={constants.NOTE_ID_CHANGELOG} />}
					/>
					{/* Known issues */}
					<Route.Route
						path={constants.PATH_KNOWN_ISSUES}
						title="Known issues"
						exact
						children={<Note noteID={constants.NOTE_ID_KNOWN_ISSUES} />}
					/>
					{/* Note */}
					<Route.Route path={constants.PATH_NOTE} exact>
						<User.Context.Consumer>
							{user => !user ? (
								<Note noteID={Router.useParams().noteID} />
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
