import * as Feather from "react-feather"
import getStatus from "./getStatus"
import getStatusLHS from "./getStatusLHS"
import getStatusRHS from "./getStatusRHS"
import React from "react"

const StatusBar = ({ state, ...props }) => {
	const status = getStatus(state)

	return (
		<div className="px-6 py-1 fixed inset-x-0 bottom-0 flex flex-row justify-between bg-white shadow-xs">
			<p className="tnum font-500 text-xs text-gray-800">
				{getStatusLHS(status)}
			</p>
			<p className="tnum font-500 text-xs text-gray-800">
				{getStatusRHS(status)}
			</p>
		</div>
	)
}

export default StatusBar
