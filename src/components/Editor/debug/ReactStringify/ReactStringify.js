// `isReactElement` returns whether a value is a React
// element.
function isReactElement(value) {
	const ok = (
		value &&
		value.$$typeof &&
		value.$$typeof === Symbol.for("react.element")
	)
	return ok
}

// `ReactDestructure` destructures a React component.
function ReactDestructure(value, ComponentTypesMap) {
	// Guard non-objects:
	if (!value || typeof value !== "object") {
		return value
	}
	// Guard arrays:
	if (Array.isArray(value)) {
		return value.map(each => ReactDestructure(each, ComponentTypesMap))
	}
	// Guard non-React components:
	if (!isReactElement(value)) {
		return value
	}
	// Guard components that use `React.memo`:
	let { type, props } = value
	if (type.type) {
		type = type.type
	}
	return { Component: ComponentTypesMap[type], props }
}

// `ReactStringify` is a replacer function that recursively
// destructures a React component tree.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function ReactStringify(ComponentTypesMap) {
	const replacer = (key, value) => {
		if (!isReactElement(value)) {
			return value
		}
		return ReactDestructure(value, ComponentTypesMap)
	}
	return replacer
}

export default ReactStringify
