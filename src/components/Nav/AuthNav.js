import * as constants from "__constants"
import * as DropDown from "./DropDown"
import * as Hero from "react-heroicons"
import * as SVG from "svgs"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

// {/* News */}
// <div className="px-3 relative flex flex-row items-center">
//
// 	{/* Icon */}
// 	<button className="text-gray-500 hover:text-blue-500 focus:text-blue-500 focus:outline-none trans-150" onClick={e => setDropDown(!dropDown)}>
// 		<Hero.AnnotationSolidSm className="w-6 h-6" />
// 	</button>
//
// 	{/* Links */}
// 	<DropDown ref={ref}>
// 		<DropDownLink
// 			to={constants.TODO}
// 			text="Version 0.1"
// 			subtext="Released March 9"
// 		/>
// 		<hr className="my-2" />
// 		<DropDownLink
// 			to={constants.TODO}
// 			text="Version 0.2"
// 			subtext="Released March 10"
// 		/>
// 		<hr className="my-2" />
// 		<DropDownLink
// 			to={constants.TODO}
// 			text="Version 0.3"
// 			subtext="Released March 11"
// 		/>
// 	</DropDown>
//
// </div>

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

					<button className="text-gray-500 hover:text-blue-500 focus:text-blue-500 rounded-full focus:outline-none focus:shadow-outline overflow-hidden trans-150" onPointerDown={e => e.preventDefault()} onClick={e => setDropDown(!dropDown)}>
						<div className="relative">
							<img className="w-8 h-8" src={user.photoURL || constants.TRANSPARENT_PX} alt="" />
							<div className="absolute inset-0 -z-10">
								<Hero.UserCircleSolidSm className="w-8 h-8 transform scale-125" />
							</div>
						</div>
					</button>

					<DropDown.Base ref={ref}>
						<DropDown.Link
							to={constants.PATH_NEW_NOTE}
							text="Create a new note"
						/>
						<DropDown.Link
							to={constants.PATH_MY_NOTES}
							text="My notes"
						/>
						<hr className="my-1" />
						<DropDown.Link
							to={constants.PATH_CHANGELOG}
							text="Changelog"
						/>
						<hr className="my-1" />
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
