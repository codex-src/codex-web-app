import React from "react"
import trimSpaces from "lib/trimSpaces"

export const HeaderBlock = ({ className, children }) => (
	<div className={className}>
		{React.cloneElement(children[0], {
			className: trimSpaces(`font-medium text-3xl sm:text-4xl Poppins
				${children[0].props.className}`),
		})}
		{children[1] && (
			React.cloneElement(children[1], {
				className: trimSpaces(`text-lg Poppins
					${children[1].props.className}`),
			})
		)}
	</div>
)

export const Focusable = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out
			${children.props.className}
				${className}`),
	})
)

export const Label = ({ className, children }) => (
	React.cloneElement(children, {
		className: trimSpaces(`block font-medium text-sm leading-5 text-gray-700
			${children.props.className}
				${className}`),
	})
)

export const InputBlock = ({ className, children }) => (
	<div className={className}>
		<Label>
			{children[0]}
		</Label>
		<div className="mt-1 rounded-md shadow-sm">
			{React.cloneElement(children[1], {
				className: trimSpaces(`form-input w-full transition duration-150 ease-in-out
					${children[1].props.className}`),
			})}
		</div>
	</div>
)
