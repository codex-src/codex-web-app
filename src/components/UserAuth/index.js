import * as constants from "__constants"
import * as GraphQL from "graphql"
import * as ProgressBar from "components/ProgressBar"
import * as SVG from "svgs"
import firebase from "__firebase"
import React from "react"

const MUTATION_REGISTER_USER = `
	mutation RegisterUser($userInput: RegisterUserInput!) {
		registerUser(userInput: $userInput)
	}
`

const UserAuth = props => {
	const renderProgressBar = ProgressBar.useProgressBar()

	const signIn = async provider => {
		const response = await firebase.auth().signInWithPopup(provider)
		renderProgressBar()
		if (!response.additionalUserInfo.isNewUser) {
			// No-op
			return
		}
		try {
			await GraphQL.newQuery("", MUTATION_REGISTER_USER, {
				userInput: {
					userID:        response.user.uid,
					email:         response.user.email,
					emailVerified: response.user.emailVerified,
					authProvider:  response.additionalUserInfo.providerId,
					photoURL:      response.user.photoURL,
					displayName:   response.user.displayName,
				},
			})
		} catch (error) {
			console.error(error)
		}
	}

	const handleClickGitHub = async e => {
		const provider = new firebase.auth.GithubAuthProvider()
		await signIn(provider)
	}

	const handleClickGoogle = async e => {
		const provider = new firebase.auth.GoogleAuthProvider()
		await signIn(provider)
	}

	return (
		// NOTE: bg-* is needed because there is no <Nav>
		<div className="-mt-8 py-40 flex flex-row justify-center items-center min-h-full bg-white dark:bg-gray-900">
			<div className="px-6 box-content" style={{ width: "18rem" /* w-72 */ }}>

				<div className="flex flex-row justify-center items-center transform scale-90 origin-bottom">
					<SVG.CodexLogo className="mr-3 w-8 h-8 stroke-medium text-md-blue-a400" />
					<SVG.CodexTextLogo className="w-32 h-8" />
				</div>

				<div className="h-8" />
				<p className="text-center font-medium text-lg leading-snug text-gray-900">
					Choose one of the following to<br />
					open your{" "}
					<a className="text-md-blue-a400 cursor-pointer" href={constants.URL} target="_blank" rel="noopener noreferrer">
						Codex
					</a>
					:
				</p>

				{/* GitHub */}
				<div className="h-6" />
				<button className="px-4 py-3 flex flex-row items-center w-full bg-black rounded-lg focus:outline-none shadow-hero focus:shadow-outline trans-150" onClick={handleClickGitHub}>
					<div className="mx-4">
						<SVG.GitHubLogo className="w-6 h-6 text-gray-100" />
					</div>
					<p className="font-semibold text-lg text-gray-100">
						Continue with GitHub
					</p>
				</button>

				{/* Google */}
				<div className="h-2" />
				<button className="px-4 py-3 flex flex-row items-center w-full bg-white rounded-lg focus:outline-none shadow-hero focus:shadow-outline trans-150" onClick={handleClickGoogle}>
					<div className="mx-4">
						<SVG.GoogleLogo className="w-6 h-6 text-gray-900" />
					</div>
					<p className="font-semibold text-lg text-gray-900">
						Continue with Google
					</p>
				</button>

			</div>
		</div>
	)
}

export default UserAuth
