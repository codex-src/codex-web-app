// `destructureReact` destructures a React component.
function destructureReact(Component, ComponentMap) {
	// Guard non-objects:
	if (!Component || typeof Component !== "object") {
		return Component
	}
	// Guard arrays:
	if (Array.isArray(Component)) {
		return Component.map(each => destructureReact(each, ComponentMap))
	}
	// Guard non-React components:
	if (!Component.$$typeof && Component.$$typeof !== Symbol.for("react.element")) {
		return Component
	}
	// Use type.type because of `React.memo`.
	const { type, props } = Component
	return { Component: ComponentMap[type.type], props }
}

// `stringifyReact` stringifies an object with React
// components.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function stringifyReact(state, ComponentMap) {
	const data = JSON.stringify(
		state,
		(key, value) => {
			if (key === "Components" || key === "children") {
				return destructureReact(value, ComponentMap)
			}
			return value
		},
		"\t",
	)
	return data
}

export default stringifyReact
