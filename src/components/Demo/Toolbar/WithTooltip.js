import React from "react"

const Tooltip = props => (
	<div className="my-2 px-2 py-1 bg-black rounded-sm opacity-90">
		<p className="whitespace-pre font-700 text-xs text-gray-100">
			{props.children}
		</p>
	</div>
)

const WithTooltip = ({ tooltip, ...props }) => {
	const [show, setShow] = React.useState(false)

	return (
		<div
			className="relative"
			onPointerEnter={e => setShow(!!1)} // T
			onPointerLeave={e => setShow(!!0)} // F
		>
			{show && (
				<div className="absolute left-1/2 bottom-full transform -translate-x-1/2">
					<Tooltip>
						{tooltip}
					</Tooltip>
				</div>
			)}
			{props.children}
		</div>
	)
}

export default WithTooltip
