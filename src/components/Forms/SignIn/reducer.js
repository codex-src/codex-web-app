export const initialState = {
	username: "",
	password: "",
	show:     false,
	info:     null,
	warn:     "",
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
	setShow(show) {
		state.show = show
	},
	setInfo(info) {
		state.info = info
	},
	setWarn(warn) {
		state.warn = warn
	},
})
