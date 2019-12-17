import React from "react"
import stylex from "stylex"

export const boxShadow = {
	boxShadow: "0 0 0 1px #E0E0E0, 0 2px 4px rgba(0, 0, 0, 0.07), 0 1px 1.5px rgba(0, 0, 0, 0.05)",
}

export const Input = React.forwardRef(({ style, ...props }, ref) => (
	<input ref={ref} style={{ ...stylex("block w:max"), ...style }} {...props} />
))

// FIXME: Is `type="button"` needed?
export const Button = React.forwardRef(({ style, ...props }, ref) => (
	<button ref={ref} style={{ ...stylex("block w:max"), ...style }} type="button" {...props}>
		{props.children}
	</button>
))

export const StyledInput = ({ style, ...props }) => (
	<Input style={{ ...stylex("p-x:16 h:48 br:6"), ...style }} {...props} />
)

export const StyledInputWithBoxShadow = ({ style, ...props }) => (
	<StyledInput style={{ ...boxShadow, ...style }} {...props} />
)
