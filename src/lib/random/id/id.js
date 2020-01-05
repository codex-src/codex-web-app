import uuidv4 from "uuid/v4"

// TODO: Add tests.

const baseURL62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const baseURL64 = `${baseURL62}-_`

// `newFourByteHash` generates a new four-byte hash.
export function newFourByteHash() {
	return Math.random().toString(16).slice(2, 6)
}

// `newSevenByteHash` generates a new seven-byte hash.
export function newSevenByteHash() {
	return Math.random().toString(16).slice(2, 9)
}

// `newURL62` returns a new URL62 ID.
export function newURL62ID(length) {
	let url62ID = ""
	let index = 0
	while (index < length) {
		const rand = Math.floor(Math.random() * baseURL62.length)
		url62ID += baseURL62[rand]
		index++
	}
	return url62ID
}

// `newURL64` returns a new URL64 ID.
export function newURL64ID(length) {
	let url64ID = ""
	let index = 0
	while (index < length) {
		const rand = Math.floor(Math.random() * baseURL64.length)
		url64ID += baseURL64[rand]
		index++
	}
	return url64ID
}

// `newUUID` returns a new UUID (v4).
//
// https://github.com/kelektiv/node-uuid
export function newUUID(showHyphens = true) {
	const uuid = uuidv4()
	if (!showHyphens) {
		return uuid.replace("-", "")
	}
	return uuid
}
