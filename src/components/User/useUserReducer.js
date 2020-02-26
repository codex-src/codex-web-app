import useMethods from "use-methods"

// // https://firebase.google.com/docs/reference/js/firebase.User
// user: {
//   displayName
//   email
//   emailVerified
//   isAnonymous
//   metadata: {
//   	// https://firebase.google.com/docs/reference/js/firebase.auth.UserMetadata
//   	creationTime
//   	lastSignInTime
//   }
//   phoneNumber
//   photoURL
//   providerData
//   providerId
//   refreshToken
//   tenantId
//   uid
// }

// TODO: React.useState()?
const reducer = state => ({
	login(user) {
		return user
	},
	logout() {
		return null
	},
})

const useUser = () => useMethods(reducer, null)

export default useUser
