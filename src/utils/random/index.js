const baseURL62 = (
	"abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
	"0123456789"
)

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

// Generates an auto ID based on Firebase.
//
// https://github.com/firebase/firebase-js-sdk/blob/6abd6484730971e2390b2b9acbb61800852fb350/packages/firestore/src/util/misc.ts#L35
export function newAutoID() {
	return newURL62(20)
}
