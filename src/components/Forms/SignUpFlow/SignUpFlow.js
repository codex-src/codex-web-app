import * as SignUpBillingReducer from "./SignUpBillingReducer"
import * as SignUpReducer from "./SignUpReducer"
import React from "react"
import SignUp from "./SignUp"
import SignUpBilling from "./SignUpBilling"
import useMethods from "use-methods"

// <Overlay>
// 	{!state1.complete ? (
// 		<SignUp state={state1} dispatch={dispatch1} />
// 	) : (
// 		<SignUpBilling state={{ ...state1, ...state2 }} dispatch={dispatch2} />
// 	)}
// </Overlay>

function SignUpFlow(props) {
	const [state1, dispatch1] = useMethods(SignUpReducer.reducer, SignUpReducer.initialState)
	const [state2, dispatch2] = useMethods(SignUpBillingReducer.reducer, SignUpBillingReducer.initialState)

	if (!state1.complete) {
		return <SignUp state={state1} dispatch={dispatch1} />
	}
	const mergedState = { ...state1, ...state2 }
	return <SignUpBilling state={mergedState} dispatch={dispatch2} />
}

export default SignUpFlow
