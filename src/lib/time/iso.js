// E.g. 2006-01-02.
export function getISODate() {
	return new Date().toISOString().split("T")[0]
}

// E.g. 15:04:05.000.
export function getISOTime() {
	return new Date().toISOString().split("T")[1].split("Z")[0]
}

// E.g. 2006-01-02T15:04:05.000Z.
export function getISODateTime() {
	return new Date().toISOString()
}
