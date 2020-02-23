import uuidv4 from "uuid/v4"

const baseURL62 = (
	"abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
	"0123456789"
)

const baseURL64 = `${baseURL62}-_`

export function newFourByteHash() {
	return Math.random().toString(16).slice(2, 6)
}

export function newSevenByteHash() {
	return Math.random().toString(16).slice(2, 9)
}

export function newURL62(length) {
	let hash = ""
	for (let index = 0; index < length; index++) {
		const rand = Math.floor(Math.random() * baseURL62.length)
		hash += baseURL62[rand]
	}
	return hash
}

export function newURL64(length) {
	let hash = ""
	for (let index = 0; index < length; index++) {
		const rand = Math.floor(Math.random() * baseURL64.length)
		hash += baseURL64[rand]
	}
	return hash
}

export function newUUID() {
	return uuidv4()
}
