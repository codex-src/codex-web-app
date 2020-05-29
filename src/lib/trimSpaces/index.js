// Trims extraneous spaces.
function trimSpaces(str) {
	return str.split(/\s+/).filter(each => {
		const ok = (
			each !== "" &&
			each !== "undefined" &&
			each !== "false"
		)
		return ok
	}).join(" ")
}

export default trimSpaces
