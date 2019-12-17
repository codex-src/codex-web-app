export const initialState = {
	isAuth:    false, // Is the user authenticated?
	userID:    "",    // The user’s ID.
	createdAt: "",    // The user’s created at date.
	updatedAt: "",    // The user’s updated at date.
	username:  "",    // The user’s username.
}

export const reducer = state => ({
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
