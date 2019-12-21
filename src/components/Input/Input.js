import * as Base from "./Base"
import React from "react"
import stylex from "stylex"

export const Text = stylex.Styleable(props => (
	<Base.StyledInputWithBoxShadow type="text" {...props} />
))

export const Password = stylex.Styleable(props => (
	<Base.StyledInput style={props.type === "password" ? stylex.parse("ls:10%") : null} {...props} />
))

export const Passcode = stylex.Styleable(props => (
	<Base.StyledInput style={stylex.parse("ls:25%")} {...props} />
))

export const Keychain = stylex.Styleable(props => (
	<Base.StyledInput style={stylex.parse("center ls:25%")} {...props} />
))

export const StripeCard = stylex.Styleable(props => (
	<div id="card-element" style={{ ...stylex.parse("p-x:16 p-y:14.4075 h:48 br:6"), ...Base.boxShadow, cursor: "text" }} {...props} />
))
