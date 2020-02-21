import * as Feather from "react-feather"
import getStatus from "./getStatus"
import getStatusLHS from "./getStatusLHS"
import getStatusRHS from "./getStatusRHS"
import React from "react"

// <div className="px-6 py-1 fixed inset-x-0 bottom-0 flex flex-row justify-between bg-white shadow-xs">
// 	<p className="tnum font-500 text-xs text-gray-800">
// 		{getStatusLHS(status)}
// 	</p>
// 	<p className="tnum font-500 text-xs text-gray-800">
// 		{getStatusRHS(status)}
// 	</p>
// </div>

const StatusBar = ({ state, ...props }) => {
	const status = getStatus(state)

	return (
		<div className="mx-6 my-2 fixed inset-x-0 bottom-0 hidden xl:flex xl:flex-row xl:justify-between xl:items-center">
			{/* LHS: */}
			<div className="flex flex-row items-center text-gray-800">
				<Feather.Scissors className="w-3 h-3 stroke-500" />
				<span style={{ width: "0.375rem" }} />
				<p className="tnum font-500 text-xs">
					{getStatusLHS(status)}
				</p>
			</div>
			{/* RHS: */}
			<div className="flex flex-row items-center text-gray-800">
				<p className="tnum font-500 text-xs">
					{getStatusRHS(status)}
				</p>
				<span style={{ width: "0.375rem" }} />
				<Feather.Bookmark className="w-3 h-3 stroke-500" />
			</div>
		</div>
	)
}

export default StatusBar
