// import * as ProgressBar from "components/ProgressBar"
import * as constants from "__constants"
import * as Feather from "react-feather"
import Container from "components/Container"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"

const UserAuth = props => {
	// const render = ProgressBar.useProgressBar()

	const handleClickGitHub = e => {
		const p = new firebase.auth.GithubAuthProvider()
		firebase.auth()
			.signInWithPopup(p)
			.catch(err => {
				console.warn(err)
			})
	}
	const handleClickGoogle = e => {
		const p = new firebase.auth.GoogleAuthProvider()
		firebase.auth()
			.signInWithPopup(p)
			.catch(err => {
				console.warn(err)
			})
	}
	const handleClickGuest = e => {
		// render()
		firebase.auth()
			.signInAnonymously()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<Container>
			<div className="w-72">

				<div className="mb-6 flex flex-row justify-center items-center transform scale-90 origin-bottom">
					<Feather.Layers className="mr-3 w-8 h-8 stroke-medium text-md-blue-a400" />
					<CodexLogo className="w-32 h-8" />
				</div>

				<p className="my-6 text-center font-medium text-lg text-gray-900">
					Choose one of the following to{" "}
					open your <a className="text-md-blue-a400 cursor-pointer" href={constants.URL} target="_blank" rel="noopener noreferrer">Codex</a>
				</p>

				{/* GitHub: */}
				<Link className="my-2 px-4 py-3 flex flex-row items-center bg-black hover:bg-gray-900 active:bg-black rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" onClick={handleClickGitHub}>
					<div className="mx-4">
						<GitHubLogo className="w-6 h-6 text-gray-100" />
					</div>
					<p className="font-semibold text-px text-gray-100">
						Continue with GitHub
					</p>
				</Link>

				{/* Google: */}
				<Link className="my-2 px-4 py-3 flex flex-row items-center bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" onClick={handleClickGoogle}>
					<div className="mx-4">
						<GoogleLogo className="w-6 h-6 text-gray-900" />
					</div>
					<p className="font-semibold text-px text-gray-900">
						Continue with Google
					</p>
				</Link>

				<hr className="mx-auto my-6 w-32" />

				<p className="mt-6 text-center font-medium text-lg text-gray-900">
					Or link an account later and{" "}
					<span className="text-md-blue-a400 cursor-pointer" onClick={handleClickGuest}>continue as a guest</span>
				</p>

			</div>
		</Container>
	)
}

export default UserAuth
