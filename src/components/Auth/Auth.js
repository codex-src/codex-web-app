import * as constants from "__constants"
import * as Feather from "react-feather"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"

const Auth = props => {
	const [, { login }] = User.useUser()

	const handleClickGitHub = e => {
		const provider = new firebase.auth.GithubAuthProvider()
		firebase.auth().signInWithPopup(provider).then(res => {
			login(res.user)
		}).catch(err => {
			console.warn(err)
		})
	}

	const handleClickGoogle = e => {
		const provider = new firebase.auth.GoogleAuthProvider()
		firebase.auth().signInWithPopup(provider).then(res => {
			login(res.user)
		}).catch(err => {
			console.warn(err)
		})
	}

	return (
		<div className="-mt-16 px-6 py-32 flex flex-row justify-center items-center min-h-full">
			<div className="w-72">

				{/* Logo: */}
				<div className="my-6 flex flex-row justify-center items-center transform scale-110 origin-bottom">
					<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
					<CodexLogo className="w-24 h-6" />
				</div>

				{/* Text: */}
				<p className="my-6 text-center font-medium text-px text-gray-900 select-none">
					Choose one of the following to{" "}
					continue with{" "}
					<Link className="text-md-blue-a400" to={constants.URL}>
						Codex
					</Link>:
				</p>

				{/* GitHub: */}
				<div className="my-2 px-4 py-3 flex flex-row items-center bg-black hover:bg-gray-900 active:bg-black rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero cursor-pointer select-none tx-150" onClick={handleClickGitHub}>
					<div className="mx-4">
						<GitHubLogo className="w-6 h-6 text-gray-100" />
					</div>
					<p className="font-semibold text-px text-gray-100">
						Continue with GitHub
					</p>
				</div>

				{/* Google: */}
				<div className="my-2 px-4 py-3 flex flex-row items-center bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero cursor-pointer select-none tx-150" onClick={handleClickGoogle}>
					<div className="mx-4">
						<GoogleLogo className="w-6 h-6 text-gray-900" />
					</div>
					<p className="font-semibold text-px text-gray-900">
						Continue with Google
					</p>
				</div>

				{/* Text: */}
				{/* <hr className="my-8" /> */}
				{/* <p className="my-6 text-center font-medium text-px text-gray-900 select-none"> */}
				{/* 	Just want to look around? <span className="emoji">👀</span><br /> */}
				{/* 	<Link className="text-md-blue-a400" to={constants.PATH_HELP}> */}
				{/* 		Continue as a guest */}
				{/* 	</Link> */}
				{/* </p> */}

			</div>
		</div>
	)
}

export default Auth
