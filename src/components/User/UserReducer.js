// import useMethods from "use-methods"
//
// const initialState = {
// 	isAuth:    false, // Is the user authenticated?
// 	userID:    "",    // The ID.
// 	createdAt: "",    // The created at date.
// 	updatedAt: "",    // The updated at date.
// 	username:  "",    // The username.
// }
//
// const reducer = state => ({
// 	login(payload) {
// 		Object.assign(state, {
// 			isAuth: true,
// 			...payload,
// 		})
// 	},
// 	logout() {
// 		Object.assign(state, {
// 			...initialState,
// 		})
// 	},
// })
//
// const useUser = () => useMethods(reducer, initialState)
//
// export default useUser
