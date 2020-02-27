import * as constants from "__constants"
import * as Feather from "react-feather"
import Link from "components/Link"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"

const UnauthNav = React.forwardRef(({ dropDown, ...props }, ref) => (
	<div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30 select-none">
		<div className="relative flex flex-row justify-between w-full max-w-screen-lg">

			{/* LHS: */}
			<div className="-mx-3 flex flex-row">
				<Link className="px-3 flex flex-row items-center" to={constants.PATH_HOME} data-e2e="nav-home">
					<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
					<CodexLogo className="w-24 h-6" />
				</Link>
			</div>

			{/* RHS: */}
			<div className="-mx-3 flex flex-row md:hidden">
				<div className="p-3 flex flex-row items-center cursor-pointer" onClick={e => dropDown[1](!dropDown[0])}>
					<Feather.Menu className="w-6 h-6 stroke-500" />
				</div>
			</div>

			{/* RHS - drop down: */}
			<div ref={ref} className={`-mx-3 -mt-4 md:mt-0 py-4 md:py-0 absolute right-0 top-full ${!dropDown[0] ? "hidden" : "block"} md:static md:flex md:flex-row bg-white rounded-lg shadow-hero-lg md:shadow-none`}>
				<Link to={constants.PATH_TODO} className="px-7 md:px-3 py-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
					<p className="font-medium">
						What’s Codex?
					</p>
				</Link>
				<Link to={constants.PATH_TODO} className="px-7 md:px-3 py-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
					<p className="font-medium">
						What can I do with Codex?
					</p>
				</Link>
				<Link to={constants.PATH_DEMO} className="px-7 md:px-3 py-3 flex flex-row items-center text-gray-800 hover:text-md-blue-a400 hover:bg-gray-100 md:hover:bg-transparent active:bg-gray-200 tx-75">
					<p className="font-medium">
						Try the editor
					</p>
				</Link>
				<div className="mx-3 md:ml-3 mt-4 md:mt-0 flex flex-row items-center">
					<Link className="px-4 py-3 flex flex-row items-center text-md-blue-a400 bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero tx-150" to={constants.PATH_AUTH} data-e2e="nav-cta-btn">
						<p className="font-medium">
							Open your Codex
						</p>
					</Link>
				</div>
			</div>

		</div>
	</div>
))

export default UnauthNav
