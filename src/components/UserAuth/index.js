import * as GraphQL from "graphql"
import * as Icons from "svgs"
import * as ProgressBar from "components/ProgressBar"
import firebase from "__firebase"
import Icon from "utils/Icon"
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
			<div className="px-6 box-content" style={{ width: "18rem" }}>

				<div className="flex flex-row justify-center items-center transform scale-125">
					{/* NOTE: mr-* is preferred because of flex */}
					<div className="mr-2">
						<Icon className="w-6 h-6 stroke-medium text-md-blue-a400" svg={Icons.CodexLogo} />
					</div>
					<Icon className="w-24 h-6 text-black dark:text-white" svg={Icons.CodexTextLogo} />
				</div>

				<div className="h-8" />
				<p className="text-center font-medium text-lg leading-snug text-gray-800 dark:text-gray-200">
					Choose one of the following to<br />
					open your Codex:
					{/* <a className="text-md-blue-a400 cursor-pointer" href={constants.URL} target="_blank" rel="noopener noreferrer"> */}
					{/* 	Codex */}
					{/* </a> */}
					{/* : */}
				</p>

				{/* GitHub */}
				<div className="h-6" />
				<button className="px-4 py-3 flex flex-row items-center w-full bg-black dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-lg focus:outline-none shadow-hero focus:shadow-outline transition duration-150" onClick={handleClickGitHub}>
					<div className="mx-4">
						<Icon className="w-6 h-6 text-gray-100 transform scale-110" svg={Icons.GitHubLogo} />
					</div>
					<p className="font-semibold text-lg text-gray-100 dark:text-gray-100">
						Continue with GitHub
					</p>
				</button>

				{/* Google */}
				<div className="h-2" />
				<button className="px-4 py-3 flex flex-row items-center w-full bg-white dark:bg-gray-800 border border-transparent dark:border-gray-750 rounded-lg focus:outline-none shadow-hero focus:shadow-outline transition duration-150" onClick={handleClickGoogle}>
					<div className="mx-4">
						<Icon className="w-6 h-6 text-gray-100 transform scale-110" svg={Icons.GoogleLogo} />
					</div>
					<p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
						Continue with Google
					</p>
				</button>

			</div>
		</div>
	)
}

export default UserAuth
