export const initialState = {
	username:    "",
	passcode:    "",
	lastFour:    "",
	newPassword: "",
	info:        "",
	warn:        "",
}

export const reducer = state => ({
	setUsername(username) {
		state.warn = ""
		state.username = username
	},
	setPasscode(passcode) {
		state.warn = ""
		state.passcode = [...passcode].join("").slice(0, 4)
	},
	setLastFour(lastFour) {
		state.warn = ""
		state.lastFour = [...lastFour].join("").slice(0, 4)
	},
	setNewPassword(newPassword) {
		state.warn = ""
		state.newPassword = newPassword
	},
	setInfo(info) {
		state.info = info
	},
	setWarn(warn) {
		state.warn = warn
	},
})
