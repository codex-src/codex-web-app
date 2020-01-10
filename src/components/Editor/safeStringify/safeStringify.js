// `safeDestructure` safely destructures a component.
function safeDestructure(Component, Types) {
	// Guard non-objects:
	if (!Component || typeof Component !== "object") {
		return Component
	}
	// Guard arrays:
	if (Array.isArray(Component)) {
		return Component.map(each => safeDestructure(each, Types))
	}
	// Guard non-React components:
	if (!Component.$$typeof && Component.$$typeof !== Symbol.for("react.element")) {
		return Component
	}
	const { type, props } = Component
	return { Component: Types[type], props }
}

// `safeStringify` safely stringifies a state object.
// `Types` maps component references to a plain text string.
function safeStringify(state, Types) {
	const data = JSON.stringify(
		state,
		(key, value) => {
			if (key === "Components" || key === "children") {
				return safeDestructure(value, Types)
			}
			return value
		},
		"\t",
	)
	return data
}

export default safeStringify
