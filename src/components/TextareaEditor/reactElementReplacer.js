// Returns whether a value is a React element.
function isReactElement(value) {
	if (!value) {
		return false
	}
	const ok = (
		value.$$typeof &&
		value.$$typeof === Symbol.for("react.element")
	)
	return ok
}

// Destructure a React element.
function destructure(value, componentMap) {
	// Guard non-objects:
	if (!value || typeof value !== "object") {
		return value
	}
	// Guard arrays:
	if (Array.isArray(value)) {
		return value.map(each => destructure(each, componentMap))
	}
	// Guard non-components:
	if (!isReactElement(value)) {
		return value
	}
	// Guard memoized components (React.memo):
	let { type, props } = value
	if (type.type) {
		type = type.type
	}
	return { Component: componentMap[type], props }
}

// Returns a replacer function that recursively destructures
// React elements. componentMap maps React component
// references (keys) to plain text strings.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function reactElementReplacer(componentMap) {
	const replacer = (key, value) => {
		if (!isReactElement(value)) {
			return value
		}
		return destructure(value, componentMap)
	}
	return replacer
}

export default reactElementReplacer
