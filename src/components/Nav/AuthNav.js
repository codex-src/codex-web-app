import * as constants from "__constants"
import * as Feather from "react-feather"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useTransition from "utils/hooks/useTransition"

import "./AuthNav.css"

const AuthNav = React.forwardRef(({ dropDown, ...props }, ref) => {
	const user = User.useUser()

	useTransition({
		ref,
		state: dropDown[0],
		enterClass: "drop-down-enter",
		activeClass: "drop-down-active",
		durationMs: 300,
	})

	const handleClickSignOut = e => {
		firebase.auth()
			.signOut()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30 select-none">
			<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

				{/* LHS: */}
				<Link className="-mx-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<Feather.Layers className="mx-3 w-8 h-8 text-md-blue-a400" />
				</Link>

				{/* RHS: */}
				<Link className="-mx-3 flex flex-row items-center cursor-pointer" onClick={e => dropDown[1](!dropDown[0])}>
					<img className="mx-3 w-8 h-8 bg-gray-200 rounded-full" src={user.photoURL || constants.IMG_TRANS} alt="TODO" />
				</Link>

				{/* RHS - drop down: */}
				<div ref={ref} className="-mx-3 -mt-3 py-2 absolute right-0 top-full w-56 bg-white rounded-lg shadow-hero-lg">
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							Create a new note
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
							^+N
						</div>
					</Link>
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							My notes
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
							^+M
						</div>
					</Link>
					<hr className="my-1" />
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							Settings
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
							^+S
						</div>
					</Link>
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:bg-md-gray-100 active:bg-md-gray-200 tx-75">
						<p className="font-medium -text-px">
							Upgrade to unlimited
						</p>
					</Link>
					<hr className="my-1" />
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-red-600 hover:bg-red-100 active:bg-red-200 tx-75" onClick={handleClickSignOut}>
						<p className="font-medium -text-px">
							Sign out
						</p>
						<div className="ml-2 px-1 py-px font-mono text-xs tracking-widest text-gray-600 bg-gray-50 border rounded">
							^+Q
						</div>
					</Link>
				</div>

			</div>
		</div>
	)
})

export default AuthNav
