import * as constants from "__constants"
import * as DropDown from "./DropDown"
import * as SVG from "svgs"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

const Content = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const [dropDown, setDropDown] = useDropDown(ref)

	// Force blur:
	React.useLayoutEffect(() => {
		ref.current.blur()
	}, [dropDown])

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
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
					<SVG.CodexLogo className="w-8 h-8 text-md-blue-a400" />
				</Link>
			</div>

			{/* RHS */}
			<div className="-mx-3 flex flex-row">
				<div className="px-3 relative flex flex-row items-center">

					{/* Button */}
					<button className="bg-gray-100 rounded-full focus:outline-none focus:shadow-outline overflow-hidden trans-150" onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<img className="w-8 h-8" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
					</button>

					{/* Drop down */}
					<DropDown.Base ref={ref}>
						<DropDown.Link
							to={constants.PATH_NEW_NOTE}
							text="Create a new note"
						/>
						<DropDown.Link
							to={constants.PATH_MY_NOTES}
							text="My notes"
						/>
						<hr className="my-2" />
						<DropDown.Link
							to={constants.PATH_README}
							text="Readme"
						/>
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							text="Changelog"
						/>
						<hr className="my-2" />
						<DropDown.Link
							onClick={handleClickSignOut}
							text="Logout"
						/>
					</DropDown.Base>

				</div>
			</div>

		</React.Fragment>
	)
}

const AuthNav = props => {
	const ref = React.useRef()

	React.useLayoutEffect(() => {
		const handler = e => {
			if (!window.scrollY) {
				ref.current.classList.remove("shadow")
			} else {
				ref.current.classList.add("shadow")
			}
		}
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [])

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white z-30 trans-300">
			<div className="px-6 flex flex-row justify-between w-full max-w-screen-lg h-16">
				<Content />
			</div>
		</div>
	)
}

export default AuthNav
