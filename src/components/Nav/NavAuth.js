import * as Base from "./Base"
import * as constants from "__constants"
import * as Hero from "react-heroicons"
import * as SVG from "svgs"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

export const NavAuth = props => {
	const ref1 = React.useRef()
	const ref2 = React.useRef()

	const user = User.useUser()
	const [dropDown1, setDropDown1] = useDropDown(ref1)
	const [dropDown2, setDropDown2] = useDropDown(ref2)

	const handleClickSignOut = e => {
		const ok = window.confirm("Are you sure you want logout?")
		if (!ok) {
			// No-op
			return
		}
		firebase.auth().signOut().catch(err => {
			console.warn(err)
		})
	}

	return (
		<React.Fragment>

			{/* LHS */}
			<Link className="-mx-6 px-6 flex flex-row items-center" to={constants.PATH_HOME}>
				<SVG.CodexLogo className="w-6 h-6 text-md-blue-a400" />
			</Link>

			{/* Drop down menu */}
			<div className="-mx-3 flex flex-row">

				<button className="px-3 relative flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDropDown1(!dropDown1)}>
					<Hero.AnnotationSolidSm className="w-6 h-6 text-gray-500" />
					<div ref={ref1} className="-mt-2 py-2 absolute right-0 top-full w-48 bg-white rounded-lg shadow-hero">
						<Link className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_NEW_NOTE}>
							<p className="font-medium -text-px">
								Create a new note
							</p>
						</Link>
						<Link className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_MY_NOTES}>
							<p className="font-medium -text-px">
								My notes
							</p>
						</Link>
						<hr className="my-1" />
						<button className="px-4 py-2 text-gray-800 hover:text-red-600 hover:bg-red-100" onPointerDown={e => e.preventDefault()} onClick={handleClickSignOut}>
							<p className="font-medium -text-px">
								Logout
							</p>
						</button>
					</div>
				</button>

				{/* Drop down button */}
				<div className="px-3 relative flex flex-row items-center">
					<button className="text-gray-500 hover:text-md-blue-a400 focus:text-md-blue-a400 focus:outline-none trans-150" onClick={e => setDropDown2(!dropDown2)}>
						<img className="w-8 h-8 bg-gray-200 rounded-full" src={user.photoURL} alt="TODO" />
						{/* <Hero.UserCircleSolidSm className="w-6 h-6" /> */}
					</button>

					{/* Drop down */}
					<div ref={ref2} className="-mt-2 py-2 absolute right-0 top-full w-48 bg-white rounded-lg shadow-hero-lg">
						<Link
							className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100 trans-75"
							to={constants.PATH_NEW_NOTE}
						>
							<p className="font-medium -text-px">
								Create a new note
							</p>
						</Link>
						<Link
							className="px-4 py-2 text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100 trans-75"
							to={constants.PATH_MY_NOTES}
						>
							<p className="font-medium -text-px">
								My notes
							</p>
						</Link>
						<hr className="my-1" />
						<Link
							className="px-4 py-2 text-gray-800 hover:text-red-600 hover:bg-red-100 trans-75"
							onClick={handleClickSignOut}
						>
							<p className="font-medium -text-px">
								Sign out of Codex
							</p>
						</Link>

					</div>
				</div>

			</div>

		</React.Fragment>
	)
}

export default NavAuth
