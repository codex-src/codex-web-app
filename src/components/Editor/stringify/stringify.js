import * as Components from "../Components"

function destructure(Component) {
	// Guard non-objects:
	if (!Component || typeof Component !== "object") {
		return Component
	}
	// Guard arrays:
	if (Array.isArray(Component)) {
		return Component.map(each => destructure(each))
	}
	// Guard non-React components:
	if (!Component.$$typeof && Component.$$typeof !== Symbol.for("react.element")) {
		return Component
	}
	const { type, props } = Component
	return { Component: Components.types[type.name], props }
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

export default stringify
