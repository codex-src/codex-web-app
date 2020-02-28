import * as constants from "__constants"
import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"
import useClickAway from "utils/hooks/useClickAway"
import useEscape from "utils/hooks/useEscape"
import useTransition from "utils/hooks/useTransition"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"

import "./UnauthNav.css"

const UnauthNav = props => {
	const ref = React.useRef()

	const [dropDown, setDropDown] = React.useState(false)

	useEscape(dropDown, setDropDown)

	useClickAway(ref, dropDown, setDropDown)

	useTransition({
		ref,
		state: dropDown,
		enterClass: "drop-down-enter",
		activeClass: "drop-down-active",
		durationMs: 300,
	})

	return (
		<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30">
			<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

				{/* LHS: */}
				<div className="-mx-3 flex flex-row">
					<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME}>
						<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
						<CodexLogo className="w-24 h-6" />
					</Link>
				</div>

				{/* RHS: */}
				<div className="-mx-3 hidden md:flex md:flex-row">
					<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 tx-75" to={constants.PATH_TODO}>
						<p className="font-medium">
							What’s Codex?
						</p>
					</Link>
					<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 tx-75" to={constants.PATH_TODO}>
						<p className="font-medium">
							Features
						</p>
					</Link>
					<Link className="px-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 tx-75" to={constants.PATH_TODO}>
						<p className="font-medium">
							Questions
						</p>
					</Link>
					{/* CTA button: */}
					<div className="mx-3 flex flex-row items-center">
						<Link className="px-4 py-3 block text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" to={constants.PATH_AUTH}>
							<p className="font-medium">
								Open your Codex
							</p>
						</Link>
					</div>
				</div>

				{/* Drop down menu: */}
				<Link className="-mx-3 flex flex-row items-center md:hidden" onClick={e => setDropDown(!dropDown)}>
					<Feather.Menu className="mx-3 w-6 h-6 stroke-medium text-gray-800" />
				</Link>

				{/* Drop down: */}
				<div ref={ref} className="-mx-3 -mt-3 py-2 absolute right-0 top-full w-56 bg-white rounded-lg shadow-hero-lg">
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_TODO}>
						<p className="font-medium -text-px">
							What’s Codex?
						</p>
					</Link>
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_TODO}>
						<p className="font-medium -text-px">
							Features
						</p>
					</Link>
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_TODO}>
						<p className="font-medium -text-px">
							Questions
						</p>
					</Link>
					<Link className="px-4 py-2 flex flex-row justify-between items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100" to={constants.PATH_AUTH}>
						<p className="font-medium -text-px">
							Open your Codex
						</p>
					</Link>
				</div>

			</div>
		</div>
	)
}

export default UnauthNav
