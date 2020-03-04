import * as Base from "./Base"
import * as constants from "__constants"
import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

export const NavUnauth = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<Base.Container>

			{/* LHS */}
			<Link className="-mx-6 px-6 flex flex-row items-center" to={constants.PATH_HOME}>
				<Feather.Layers className="w-8 h-8 text-md-blue-a400" />
			</Link>

			{/* RHS */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				<Base.NavItem
					to={constants.TODO}
					children="Features"
				/>
				<Base.NavItem
					to={constants.TODO}
					children="Try Codex for free!"
				/>
				<Base.NavItem
					to={constants.TODO}
					children="Pricing"
				/>
				<Base.NavItemCTA
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</div>

			{/* Drop down menu */}
			<Base.DropDownMenuButtonMd onClick={e => setDropDown(!dropDown)}>
				<Feather.Menu className="w-8 h-8 stroke-medium text-gray-800" />
			</Base.DropDownMenuButtonMd>

			{/* Drop down */}
			<Base.DropDown ref={ref}>
				<Base.DropDownItem
					to={constants.PATH_AUTH}
					children="Features"
				/>
				<Base.DropDownItem
					to={constants.PATH_AUTH}
					children="Try Codex for free!"
				/>
				<Base.DropDownItem
					to={constants.PATH_AUTH}
					children="Pricing"
				/>
				<hr className="my-1" />
				<Base.DropDownItem
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</Base.DropDown>

		</Base.Container>
	)
}

export default NavUnauth
