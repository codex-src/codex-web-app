import getStatus from "./getStatus"
import getStatusStrings from "./getStatusStrings"
import React from "react"

const StatusBarsView = props => (
	<div className="px-4 py-3 fixed inset-x-0 bottom-0 flex justify-between items-center">
		{/* LHS: */}
		<div className="px-4 py-2 bg-md-gray-100 rounded-full">
			<p className="tnum font-500 text-xs text-gray-800">
				{props.lhs}
			</p>
		</div>
		{/* RHS: */}
		<div className="px-4 py-2 bg-md-gray-100 rounded-full">
			<p className="tnum font-500 text-xs text-gray-800">
				{props.rhs}
			</p>
		</div>
	</div>
)

function StatusBars({ state, ...props }) {
	const status = getStatus(state)
	const [lhs, rhs] = getStatusStrings(status)
	return <StatusBarsView lhs={lhs} rhs={rhs} />
}

export default StatusBars
