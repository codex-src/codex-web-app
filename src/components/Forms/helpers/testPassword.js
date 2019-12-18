function testPassword(password) {
	const ok = (
		/[a-z]/.test(password) &&
		/[A-Z]/.test(password) &&
		/[0-9]/.test(password)
	)
	return ok
}

export default testPassword
