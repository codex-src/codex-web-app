// E.g. 2006-01-02.
export function newISODate() {
	return new Date().toISOString().split("T")[0]
}

// E.g. 15:04:05.000.
export function newISOTime() {
	return new Date().toISOString().split("T")[1].split("Z")[0]
}

// E.g. 2006-01-02T15:04:05.000Z.
export function newISODateTime() {
	return new Date().toISOString()
}
