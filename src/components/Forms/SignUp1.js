import GraphQL from "use-graphql"
import Headers from "components/Headers"
import Input from "components/Input"
import InputStatus from "components/InputStatus"
import Overlay from "components/Overlay"
import React from "react"
import stylex from "stylex"
import testPasscode from "./helpers/testPasscode"
import testPassword from "./helpers/testPassword"
import testUsername from "./helpers/testUsername"

function SignUp({ state, dispatch, ...props }) {
	const [, testUsernameTaken] = GraphQL.useLazyQuery(`
		query TestUsernameTaken($username: String!) {
			testUsernameTaken(username: $username)
		}
	`)

	const asyncHandleSubmit = async e => {
		e.preventDefault()
		const { username, password, passcode } = state
		if (username.length < 3 || username.length > 20) {
			dispatch.setWarn("Username needs to be 3-20 characters.")
			return
		} else if (!testUsername(username)) {
			dispatch.setWarn("Username needs to be a combo of:\n\n- a-z, A-Z\n- 0-9\n- _\n\n(And start with a-z or A-Z)")
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
		const { errors, data } = await testUsernameTaken({ username })
		if (errors) {
			dispatch.setWarn("An unexpected error occurred.")
			return
		} else if (data.testUsernameTaken) {
			dispatch.setWarn(`Username ${username} is taken.`)
			return
		}
		dispatch.setComplete(true)
	}

	return (
		<Overlay>
			<div style={stylex.parse("p-x:32 p-y:128 flex -r -x:center")}>
				<form style={stylex.parse("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex.parse("m-b:40")}>
						<Headers.H1 style={stylex.parse("center")}>
							Sign up
						</Headers.H1>
						<Headers.H2 style={stylex.parse("center")}>
							to continue with <span style={stylex.parse("c:blue-a400")}>Codex</span>
						</Headers.H2>
					</header>

					<Input.Label style={stylex.parse("m-y:16")}>
						Username
						<Input.Text
							value={state.username}
							onChange={e => dispatch.setUsername(e.target.value)}
							autoComplete="new-username"
							spellCheck={false}
						/>
					</Input.Label>

					<Input.Label style={stylex.parse("m-y:16")}>
						Password
						<Input.WithShow show={state.show} setShow={dispatch.setShow}>
							<Input.Password
								value={state.password}
								onChange={e => dispatch.setPassword(e.target.value)}
								autoComplete="new-password"
								spellCheck={false}
							/>
						</Input.WithShow>
					</Input.Label>

					<Input.Label style={stylex.parse("m-y:16")}>
						Passcode (4-digit code)
						<Input.WithShow show={state.show} setShow={dispatch.setShow}>
							<Input.Passcode
								value={state.passcode}
								onChange={e => dispatch.setPasscode(e.target.value)}
								autoComplete="none"
								spellCheck={false}
							/>
						</Input.WithShow>
					</Input.Label>

					{state.info && (
						<InputStatus.Info style={stylex.parse("m-t:40 m-b:-24")}>
							{state.info}
						</InputStatus.Info>
					)}

					<Input.Submit style={stylex.parse("m-t:40 m-b:16")}>
						Continue
					</Input.Submit>

					{!state.warn ? (
						<Input.SubmitClickAway style={stylex.parse("m-t:-16")} to="/reset-password">
							I have an account
						</Input.SubmitClickAway>
					) : (
						<InputStatus.Warn style={stylex.parse("m-t:16")}>
							{state.warn}
						</InputStatus.Warn>
					)}

				</form>
			</div>
		</Overlay>
	)
}

export default SignUp