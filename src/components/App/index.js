import * as constants from "__constants"
import * as ProgressBar from "components/ProgressBar"
import * as random from "utils/random"
import * as Route from "components/Route"
import * as Router from "react-router-dom"
import * as User from "components/User"
import UserAuth from "components/UserAuth"
import Demo from "components/Demo"
import Error404 from "components/Error404"
import Home from "components/Home"
import Note from "components/Note"
import NoteContainer from "components/NoteContainer"
import React from "react"
import UserNote from "components/UserNote"
import UserNotes from "components/UserNotes"

const AnonNote = props => {
	const { noteID } = Router.useParams()

	return <Note noteID={noteID} />
}

const App = props => (
	<Router.BrowserRouter>
		<User.Provider>
			<ProgressBar.Provider>
				<ProgressBar.ProgressBar />
				<Router.Switch>

					{/* Any */}
					<Route.Any
						path={constants.PATH_README}
						title="Readme"
						exact
						// NOTE: Use key because <Note> is shared
						children={<Note key={random.newFourByteHash()} noteID={constants.NOTE_ID_README} />}
					/>
					<Route.Any
						path={constants.PATH_CHANGELOG}
						title="Changelog"
						exact
						// NOTE: Use key because <Note> is shared
						children={<Note key={random.newFourByteHash()} noteID={constants.NOTE_ID_CHANGELOG} />}
					/>
					<Route.Any
						path={constants.PATH_KNOWN_ISSUES}
						title="Known issues"
						exact
						// NOTE: Use key because <Note> is shared
						children={<Note key={random.newFourByteHash()} noteID={constants.NOTE_ID_KNOWN_ISSUES} />}
					/>

					{/* Both */}
					<Route.Any path={constants.PATH_HOME} exact>
						<User.Context.Consumer>
							{user => !user ? (
								<Home />
							) : (
								<UserNotes />
							)}
						</User.Context.Consumer>
					</Route.Any>
					<Route.Any path={constants.PATH_NOTE} exact>
						<User.Context.Consumer>
							{user => !user ? (
								<AnonNote />
							) : (
								<UserNote />
							)}
						</User.Context.Consumer>
					</Route.Any>

					{/* Unprotected */}
					<Route.Unprotected
						path={constants.PATH_DEMO}
						exact
						title="Demo"
						children={<Demo />}
					/>
					<Route.Unprotected
						path={constants.PATH_AUTH}
						title="Open your Codex"
						children={<UserAuth />}
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

					{/* 404 */}
					<Route.Any
						path="/"
						title="Page not found"
						children={
							<NoteContainer>
								<Error404 />
							</NoteContainer>
						}
					/>

				</Router.Switch>
			</ProgressBar.Provider>
		</User.Provider>
	</Router.BrowserRouter>
)

export default App
