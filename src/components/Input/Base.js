import React from "react"
import stylex from "stylex"

// https://stripe.com/docs/payments/checkout
export const boxShadow = {
	boxShadow: "0 0 0 1px #E0E0E0, 0 2px 4px rgba(0, 0, 0, 0.07), 0 1px 1.5px rgba(0, 0, 0, 0.05)",
}

/*
 * Input
 */

export const Input = stylex.Styleable(props => (
	<input style={stylex.parse("block w:max")} {...props} />
))

export const StyledInput = stylex.Styleable(props => (
	<Input style={stylex.parse("p-x:16 p-y:12 br:6")} {...props} />
))

export const StyledInputWithBoxShadow = stylex.Styleable(props => (
	<StyledInput style={boxShadow} {...props} />
))

/*
 * Button
 */

export const Button = stylex.Styleable(props => (
	<button style={stylex.parse("block w:max")} type="button" {...props}>
		{props.children}
	</button>
))

export const StyledButton = stylex.Styleable(props => (
	<Button style={stylex.parse("p-x:16 p-y:12 br:6")} {...props} />
))
