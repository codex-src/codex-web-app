import React from "react"
import SignUp from "./SignUp"
import SignUpBilling from "./SignUpBilling"
import useSignUp from "./SignUpReducer"
import useSignUpBilling from "./SignUpBillingReducer"

// <Overlay>
// 	{!state1.complete ? (
// 		<SignUp state={state1} dispatch={dispatch1} />
// 	) : (
// 		<SignUpBilling state={{ ...state1, ...state2 }} dispatch={dispatch2} />
// 	)}
// </Overlay>

function SignUpFlow(props) {
	const [state1, dispatch1] = useSignUp()
	const [state2, dispatch2] = useSignUpBilling()

	if (!state1.complete) {
		return <SignUp state={state1} dispatch={dispatch1} />
	}
	const mergedState = {
		...state1, // The profile state.
		...state2, // The billing state.
	}
	return <SignUpBilling state={mergedState} dispatch={dispatch2} />
}

export default SignUpFlow
