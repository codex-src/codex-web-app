import * as Feather from "react-feather"
import Container from "components/Container"
import CSSDebugger from "utils/CSSDebugger"
import GridView from "./GridView"
import Link from "components/Link"
import ListView from "./ListView"
import MockEditor from "./MockEditor"
import Nav from "components/Nav"
import React from "react"

const UserNotes = props => (
	<React.Fragment>
		<Nav />
		<Container>
			<div className="w-full max-w-screen-lg">

				{/* <div className="px-6 fixed inset-x-0 top-0 flex flex-row justify-center h-20 bg-white z-30"> */}

				{/* <div className="-mx-6 px-6 sticky inset-x-0 flex flex-row justify-between items-center h-20 bg-white z-30" style={{ top: "5rem" }}> */}
				<div className="mb-6 flex flex-row justify-between items-baseline">
					<h1 className="font-semibold text-4xl">
						Your notes
					</h1>
					<div className="flex flex-row">
						<Link className="px-3">
							<p className="font-semibold text-sm text-md-gray-500">
								<span className="text-md-blue-a400">List</span> / Grid
							</p>
						</Link>
						<Link className="px-3">
							<p className="font-semibold text-sm text-md-gray-500">
								Asc / <span className="text-md-blue-a400">Desc</span>
							</p>
						</Link>
					</div>
				</div>
				<div className="-mx-3 mt-6">
					<GridView />
				</div>
				<div className="-mx-3 mt-6">
					<ListView />
				</div>

			</div>
		</Container>
		{/* <CSSDebugger /> */}
	</React.Fragment>
)

export default UserNotes
