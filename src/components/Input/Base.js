import React from "react"
import stylex from "stylex"

// https://stripe.com/docs/payments/checkout
export const boxShadow = {
	boxShadow: "0 0 0 1px #E0E0E0, 0 2px 4px rgba(0, 0, 0, 0.07), 0 1px 1.5px rgba(0, 0, 0, 0.05)",
}

export const Input = ({ style, ...props }) => (
	<input style={{ ...stylex("block w:max"), ...style }} {...props} />
)

export const StyledInput = ({ style, ...props }) => (
	<Input style={{ ...stylex("p-x:16 p-y:12 br:6"), ...style }} {...props} />
)

export const StyledInputWithBoxShadow = ({ style, ...props }) => (
	<StyledInput style={{ ...boxShadow, ...style }} {...props} />
)

export const Button = ({ style, ...props }) => (
	<button style={{ ...stylex("block w:max"), ...style }} type="button" {...props}>
		{props.children}
	</button>
)

export const StyledButton = ({ style, ...props }) => (
	<Button style={{ ...stylex("p-x:16 p-y:12 br:6"), ...style }} {...props} />
)
