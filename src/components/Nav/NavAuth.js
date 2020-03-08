import * as Base from "./Base"
import * as constants from "__constants"
import * as Feather from "react-feather"
import * as User from "components/User"
import firebase from "__firebase"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

export const NavAuth = props => {
	const ref = React.useRef()

	const user = User.useUser()
	const [dropDown, setDropDown] = useDropDown(ref)

	const handleClickSignOut = e => {
		firebase.auth()
			.signOut()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<Base.Container>

			{/* LHS */}
			<Link className="-mx-6 px-6 flex flex-row items-center" to={constants.PATH_HOME}>
				<Feather.Layers className="w-8 h-8 text-md-blue-a400" />
			</Link>

			{/* Drop down menu */}
			<Base.DropDownMenuButton onClick={e => setDropDown(!dropDown)}>
				<img className="w-8 h-8 bg-gray-200 rounded-full" src={user.photoURL || constants.IMG_TRANS} alt="TODO" />
			</Base.DropDownMenuButton>

			{/* Drop down */}
			<Base.DropDown ref={ref}>
				<Base.DropDownItem
					to={constants.PATH_NEW_NOTE}
					children="Create a new note"
				/>
				<Base.DropDownItem
					to={constants.PATH_MY_NOTES}
					children="My notes"
				/>
				<hr className="my-1" />
				<Base.DropDownItem
					to={constants.TODO}
					children="Settings"
				/>
				<Base.DropDownItem
					to={constants.TODO}
					children="Upgrade to unlimited"
				/>
				<hr className="my-1" />
				<Base.DropDownItemWarn
					onClick={handleClickSignOut}
					children="Sign out"
				/>
			</Base.DropDown>

		</Base.Container>
	)
}

export default NavAuth
