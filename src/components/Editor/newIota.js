// const iota = newIota()
// iota() // 0
// iota() // 1
// iota() // 2
// iota() // 3
// iota() // 4
//
// https://golang.org/ref/spec#Iota
function newIota() {
	let didStart = false
	let value = 0
	const iota = () => {
		if (!didStart) {
			didStart = true
			return value
		}
		value++
		return value
	}
	return iota
}

export default newIota
