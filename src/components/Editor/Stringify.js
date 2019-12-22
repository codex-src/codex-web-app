import * as Components from "./Components"
import React from "react"
import stylex from "stylex"

function destructure(component) {
	// Guard three cases:
	//
	// 1. Non-objects
	// 2. Arrays
	// 3. Non-React components
	//
	if (!component || typeof component !== "object") {
		return component
	} else if (Array.isArray(component)) {
		return component.map(each => destructure(each))
	} else if (!component.$$typeof && component.$$typeof !== Symbol.for("react.element")) {
		return component
	}
	// React component:
	const { type, props } = component
	return { Component: Components.Types[btoa(type)], props }
}

function stringify(obj) {
	const data = JSON.stringify(
		obj,
		(key, value) => {
			if (key === "Components" || key === "children") {
				return destructure(value)
			}
			return value
		},
		"\t",
	)
	return data
}

const tabs = { MozTabSize: 2, tabSize: 2 }

const Stringify = stylex.Unstyleable(props => (
	<pre style={stylex.parse("overflow -x:scroll")}>
		<p style={{ ...stylex.parse("fs:12 lh:125%"), ...tabs }}>
			{stringify(props.state)}
		</p>
	</pre>
))

export default Stringify
