import useMethods from "use-methods"

const initialState = {
	isAuth:    false, // Is the user authenticated?
	userID:    "",    // The user’s ID.
	createdAt: "",    // The user’s created at date.
	updatedAt: "",    // The user’s updated at date.
	username:  "",    // The user’s username.
}

const reducer = state => ({
	login(payload) {
		Object.assign(state, {
			isAuth: true,
			...payload,
		})
	},
	logout() {
		Object.assign(state, {
			...initialState,
		})
	},
})

const useUser = () => useMethods(reducer, initialState)

export default useUser
