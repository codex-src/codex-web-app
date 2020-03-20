import * as constants from "__constants"
import * as Containers from "components/Containers"
import * as DarkMode from "components/DarkMode"
import * as ProgressBar from "components/ProgressBar"
import * as random from "utils/random"
import * as Route from "components/Route"
import * as Router from "react-router-dom"
import * as User from "components/User"
import CodexTitle from "components/CodexTitle"
import Demo from "components/Demo"
import Error404 from "components/Error404"
import Home from "components/Home"
import Note from "components/Note"
import React from "react"
import UserAuth from "components/UserAuth"
import UserNote from "components/UserNote"
import UserNotes from "components/UserNotes"

const AnyNote = props => {
	const { noteID } = Router.useParams()

	return <Note noteID={noteID} />
}

const App = props => (
	<Router.BrowserRouter>
		<DarkMode.Provider>
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
							path={constants.PATH_DEMO}
							exact
							title="Demo"
							children={<Demo />}
						/>

						{/* Shared */}
						<Route.Any
							path={constants.PATH_HOME}
							exact
							children={
								<User.Context.Consumer>
									{user => !user ? (
										// <CodexTitle title="TODO">
											<Home />
										// </CodexTitle>
									) : (
										<CodexTitle title="My notes">
											<UserNotes />
										</CodexTitle>
									)}
								</User.Context.Consumer>
							}
						/>
						<Route.Any
							path={constants.PATH_NOTE}
							exact
							children={
								<User.Context.Consumer>
									{user => !user ? (
										// <CodexTitle title="TODO">
											<AnyNote />
										// </CodexTitle>
									) : (
										// <CodexTitle title="TODO">
											<UserNote />
										// </CodexTitle>
									)}
								</User.Context.Consumer>
							}
						/>

						{/* Unprotected */}
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
								<Containers.Note>
									<Error404 />
								</Containers.Note>
							}
						/>

					</Router.Switch>
				</ProgressBar.Provider>
			</User.Provider>
		</DarkMode.Provider>
	</Router.BrowserRouter>
)

export default App
