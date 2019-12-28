import useMethods from "use-methods"

const initialState = {
	username: "",
	password: "",
	show:     false,
	info:     "",
	warn:     "",
}

const reducer = state => ({
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

const useSignIn = () => useMethods(reducer, initialState)

export default useSignIn
