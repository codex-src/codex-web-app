import * as Base from "./Base"
import * as constants from "__constants"
import * as Hero from "react-heroicons"
import * as SVG from "svgs"
import Link from "components/Link"
import React from "react"
import useDropDown from "hooks/useDropDown"

export const NavUnauth = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = useDropDown(ref)

	return (
		<React.Fragment>

			{/* LHS */}
			<Link className="-mx-6 px-6 flex flex-row items-center" to={constants.PATH_HOME}>
				<SVG.CodexLogo className="w-8 h-8 text-md-blue-a400" />
			</Link>

			{/* RHS */}
			<div className="-mx-3 hidden md:flex md:flex-row">
				{/* <Base.NavItem */}
				{/* 	to={constants.TODO} */}
				{/* 	children="Features" */}
				{/* /> */}
				{/* <Base.NavItem */}
				{/* 	to={constants.TODO} */}
				{/* 	children="Try Codex for free!" */}
				{/* /> */}
				{/* <Base.NavItem */}
				{/* 	to={constants.TODO} */}
				{/* 	children="Pricing" */}
				{/* /> */}
				<Base.NavItemCTA
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</div>

			{/* Drop down menu */}
			<Base.DropDownMenuButtonMd onClick={e => setDropDown(!dropDown)}>
				<Hero.MenuOutlineMd className="w-8 h-8 stroke-medium text-gray-800" />
			</Base.DropDownMenuButtonMd>

			{/* Drop down */}
			<Base.DropDown ref={ref}>
				{/* <Base.DropDownItem */}
				{/* 	to={constants.PATH_AUTH} */}
				{/* 	children="Features" */}
				{/* /> */}
				{/* <Base.DropDownItem */}
				{/* 	to={constants.PATH_AUTH} */}
				{/* 	children="Try Codex for free!" */}
				{/* /> */}
				{/* <Base.DropDownItem */}
				{/* 	to={constants.PATH_AUTH} */}
				{/* 	children="Pricing" */}
				{/* /> */}
				{/* <hr className="my-1" /> */}
				<Base.DropDownItem
					to={constants.PATH_AUTH}
					children="Open your Codex"
				/>
			</Base.DropDown>

		</React.Fragment>
	)
}

export default NavUnauth
