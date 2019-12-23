// ^                            - start
//   \w(?:\.?\w+?)*             - alphanum
//   (?:\+(?:\w(?:\.?\w+?)*)?)* - (+(alphanum)?)*
//   @                          - @
//   \w(?:\.?\w+?)*             - alphanum
//   \.                         - .
//   \w(?:\.?\w+?)*             - alphanum
// $                            - end
//
// start alphanum (+(alphanum)?)* @ alphanum . alphanum end
export function emailAddress(emailAddress) {
	return /^\w(?:\.?\w+?)*(?:\+(?:\w(?:\.?\w+?)*)?)*@\w(?:\.?\w+?)*\.\w(?:\.?\w+?)*$/.test(emailAddress)
}

export function username(username) {
	return /^[a-zA-Z_]\w*$/.test(username)
}

export function password(password) {
	const ok = (
		/[a-z]/.test(password) &&
		/[A-Z]/.test(password) &&
		/[0-9]/.test(password)
	)
	return ok
}

// export function passcode(passcode) {
export function integers(integers) {
	return /^\d+$/.test(integers)
}
