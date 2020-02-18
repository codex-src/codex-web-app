import * as Feather from "react-feather"
import getStatus from "./getStatus"
import getStatusStrings from "./getStatusStrings"
import React from "react"

const StatusBarView = props => (
	<div className="px-6 fixed inset-x-0 bottom-0 flex flex-row justify-between bg-gray-200">
		<p className="py-1 flex flex-row items-center tnum font-500 text-xs text-gray-800" style={{ fontSize: 11 }}>
			<Feather.Scissors
				className="p-px stroke-600 w-3 h-3"
			/>
			<div className="w-1" />
			{props.lhs}
		</p>
		<p className="py-1 flex flex-row items-center tnum font-500 text-xs text-gray-800" style={{ fontSize: 11 }}>
			{props.lhs}
			<div className="w-1" />
			<Feather.Search
				className="p-px stroke-600 w-3 h-3"
			/>
		</p>
	</div>
)

function StatusBar({ state, ...props }) {
	const status = getStatus(state)
	const [lhs, rhs] = getStatusStrings(status)
	return <StatusBarView lhs={lhs} rhs={rhs} />
}

export default StatusBar
