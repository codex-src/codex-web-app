import * as SignUpReducer from "./SignUpReducer"

import Errors from "components/Errors"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import Headers from "components/Headers"
import Inputs from "components/Inputs"
import Overlay from "components/Overlay"
import React from "react"
import Status from "components/Status"
import stylex from "stylex"
import testPasscode from "./helpers/testPasscode"
import testPassword from "./helpers/testPassword"
import testUsername from "./helpers/testUsername"
import useMethods from "use-methods"
import User from "components/User"

function SignIn(props) {
	const [, { login }] = React.useContext(User.Context)

	const [state, dispatch] = useMethods(SignUpReducer.reducer, SignUpReducer.initialState)

	const [{ fetching }, createSession] = GraphQL.useLazyMutation(`
		mutation CreateSession($username: String!, $password: String!) {
			createSession(username: $username, password: $password) {
				...user
			}
		}
		${Fragments.user}
	`)

	const asyncHandleSubmit = async e => {
		e.preventDefault()
		const { username, password, passcode } = state
		if (username.length < 3 || username.length > 20) {
			dispatch.setWarn("Username needs to be 3-20 characters.")
			return
		} else if (!testUsername(username)) {
			dispatch.setWarn("Username needs to be a combo of:\n\n- a-z, A-Z\n- 0-9\n- _\n\n(And not start with a number)")
			return
		} else if (password.length < 8) {
			dispatch.setWarn("Password needs to be 8 or more characters.")
			return
 		} else if (!testPassword(password)) {
			dispatch.setWarn("Password needs to be a combo of:\n\n- a-z\n- A-Z\n- 0-9\n\n(Spaces are allowed)")
			return
		} else if (!testPasscode(passcode)) {
			dispatch.setWarn("Passcode needs to be 4 numbers.")
			return
		}
		// Test username:
		const { errors, data } = await testUsername({ username })
		if (errors) {
			dispatch.setWarn("An unexpected error occurred.")
			return
		} else if (!data.testUsername) {
			dispatch.setWarn(`Username ${username} is taken.`)
			return
		}
		dispatch.setComplete(true)
	}

	return (
		<Overlay>
			<div style={stylex("p-x:32 p-y:128 flex -r -x:center")}>
				<div style={stylex("w:320")}>
					<form onSubmit={asyncHandleSubmit}>

						<header style={stylex("m-b:40")}>
							<Headers.H1 style={stylex("center")}>
								Sign up
							</Headers.H1>
							<Headers.H2 style={stylex("center")}>
								to continue with <span style={stylex("c:blue-a400")}>Codex</span>
							</Headers.H2>
						</header>

						<Inputs.Label style={stylex("m-y:16")}>
							Username
							<Inputs.Text
								value={state.username}
								onChange={e => dispatch.setUsername(e.target.value)}
								autoComplete="new-username"
								spellCheck={false}
							/>
						</Inputs.Label>

						<Inputs.Label style={stylex("m-y:16")}>
							Password
							<Inputs.WithShow show={state.show} setShow={dispatch.setShow}>
								<Inputs.Password
									value={state.password}
									onChange={e => dispatch.setPassword(e.target.value)}
									autoComplete="new-password"
									spellCheck={false}
								/>
							</Inputs.WithShow>
						</Inputs.Label>

						<Inputs.Label style={stylex("m-y:16")}>
							Passcode
							<Inputs.WithShow show={state.show} setShow={dispatch.setShow}>
								<Inputs.Passcode
									value={state.passcode}
									onChange={e => dispatch.setPasscode(e.target.value)}
									spellCheck={false}
								/>
							</Inputs.WithShow>
						</Inputs.Label>

						{state.info && (
							<Status.Info style={stylex("m-t:40 m-b:-24")}>
								{state.info}
							</Status.Info>
						)}

						<Inputs.Submit style={stylex("m-t:40 m-b:16")}>
							Continue
						</Inputs.Submit>

						{!state.warn ? (
							<Inputs.SubmitClickAway style={stylex("m-t:-16")} to="/reset-password">
								I have an account
							</Inputs.SubmitClickAway>
						) : (
							<Status.Warn>
								{state.warn}
							</Status.Warn>
						)}

					</form>
				</div>
			</div>
		</Overlay>
	)
}

export default SignIn
