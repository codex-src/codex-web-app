export const initialState = {
	username: "",
	password: "",
	passcode: "",
	show:     false,
	info:     "You can change these later. 👍",
	warn:     "",
	complete: false,
}

export const reducer = state => ({
	setUsername(username) {
		state.warn = ""
		state.username = username
	},
	setPassword(password) {
		state.warn = ""
		state.password = password
	},
	setPasscode(passcode) {
		state.warn = ""
		state.passcode = [...passcode].join("").slice(0, 4)
	},
	setShow(show) {
		state.show = show
	},
	setInfo(info) {
		state.info = info
	},
	setWarn(warn) {
		state.warn = warn
	},
	setComplete(complete) {
		state.complete = complete
	},
})
