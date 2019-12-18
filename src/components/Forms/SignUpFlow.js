import * as SignUp1Reducer from "./SignUp1Reducer"
import * as SignUp2Reducer from "./SignUp2Reducer"
import React from "react"
import SignUp1 from "./SignUp1"
import SignUp2 from "./SignUp2"
import useMethods from "use-methods"

// TODO: Back button (`SignUp1`).
function SignUpFlow(props) {
	const [state1, dispatch1] = useMethods(SignUp1Reducer.reducer, SignUp1Reducer.initialState)
	const [state2, dispatch2] = useMethods(SignUp2Reducer.reducer, SignUp2Reducer.initialState)

	if (state1.complete) {
		return <SignUp1 state={state1} dispatch={dispatch1} />
	}
	// Merge `state`:
	const mergedState = { ...state1, ...state2 }
	return <SignUp2 state={mergedState} dispatch={dispatch2} />
}

export default SignUpFlow
