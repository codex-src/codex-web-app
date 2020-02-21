import React from "react"

const TooltipUI = props => (
	<div className="my-2 px-2 py-1 bg-black rounded-sm opacity-90">
		<p className="whitespace-pre font-700 text-xs text-gray-100">
			{props.children}
		</p>
	</div>
)

const Tooltip = ({ tooltip, ...props }) => {
	const [show, setShow] = React.useState(false)

	return (
		<div className="relative" onPointerEnter={e => setShow(true)} onPointerLeave={e => setShow(false)}>
			{show && (
				<div className="absolute left-1/2 bottom-full transform -translate-x-1/2">
					<TooltipUI>
						{tooltip}
					</TooltipUI>
				</div>
			)}
			{props.children}
		</div>
	)
}

export default Tooltip
