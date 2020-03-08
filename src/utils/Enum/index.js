// https://stackoverflow.com/a/6672823
class Enum {
	constructor(...strings) {
		for (const string of strings) {
			this[string] = string
		}
		Object.freeze(this)
	}
}

export default Enum
