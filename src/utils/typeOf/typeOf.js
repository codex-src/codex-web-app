export function bool(value) {
	return typeof value === "boolean"
}

export function num(value) {
	return typeof value === "number"
}

export function str(value) {
	return typeof value === "string"
}

export function sym(value) {
	return typeof value === "symbol"
}

export function arr(value) {
	const ok = (
		!!value && // (Coerce to true or false)
		Array.isArray(value)
	)
	return ok
}

export function obj(value) {
	const ok = (
		!!value && // (Coerce to true or false)
		typeof value === "object"
	)
	return ok
}

export function fun(value) {
	const ok = (
		!!value && // (Coerce to true or false)
		typeof value === "function"
	)
	return ok
}
