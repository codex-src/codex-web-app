import * as SignInReducer from "./SignInReducer"
import Errors from "components/Errors"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import Headers from "components/Headers"
import Input from "components/Input"
import InputStatus from "components/InputStatus"
import Overlay from "components/Overlay"
import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"
import User from "components/User"

function SignIn(props) {
	const [, { login }] = React.useContext(User.Context)

	const [state, dispatch] = useMethods(SignInReducer.reducer, SignInReducer.initialState)

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
		const { username, password } = state
		if (username.length < 3 || username.length > 20) {
			dispatch.setWarn("Username needs to be 3-20 characters.")
			return
		} else if (password.length < 8) {
			dispatch.setWarn("Password needs to be 8+ characters.")
			return
		}
		// Create session:
		const { errors, data } = await createSession({ username, password })
		if (GraphQL.errorsIs(errors, Errors.sqlNoRows)) {
			dispatch.setWarn("Invalid username and or password.")
			return
		} else if (GraphQL.errorsIs(errors, Errors.bcryptMismatch)) {
			dispatch.setWarn("Invalid username and or password.")
			return
		} else if (errors) {
			dispatch.setWarn("An unexpected error occurred.")
			return
		}
		// Use `setTimeout` to prevent memory leak:
		setTimeout(() => {
			login(data.createSession)
		}, 0)
	}

	return (
		<Overlay>
			<div style={stylex.parse("p-x:32 p-y:128 flex -r -x:center")}>
				<form style={stylex.parse("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex.parse("m-b:40")}>
						<Headers.H1 style={stylex.parse("center")}>
							Sign in
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
							autoComplete="current-username"
							spellCheck={false}
						/>
					</Input.Label>

					<Input.Label style={stylex.parse("m-y:16")}>
						Password
						<Input.WithShow show={state.show} setShow={dispatch.setShow}>
							<Input.Password
								value={state.password}
								onChange={e => dispatch.setPassword(e.target.value)}
								autoComplete="current-password"
								spellCheck={false}
							/>
						</Input.WithShow>
					</Input.Label>

					{state.info && (
						<InputStatus.Info style={stylex.parse("m-t:40 m-b:-24")}>
							{state.info}
						</InputStatus.Info>
					)}

					<Input.Submit style={stylex.parse("m-t:40 m-b:16")} fetching={fetching}>
						Sign in
					</Input.Submit>

					{!state.warn ? (
						<Input.SubmitClickAway style={stylex.parse("m-t:-16")} to="/reset-password">
							I forgot my password
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

export default SignIn
