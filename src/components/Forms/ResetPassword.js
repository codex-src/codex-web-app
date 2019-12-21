import * as ResetPasswordReducer from "./ResetPasswordReducer"
import Errors from "components/Errors"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import Headers from "components/Headers"
import Input from "components/Input"
import InputStatus from "components/InputStatus"
import Overlay from "components/Overlay"
import React from "react"
import stylex from "stylex"
import testPasscode from "./helpers/testPasscode"
import testPassword from "./helpers/testPassword"
import useMethods from "use-methods"
import User from "components/User"

function ResetPassword(props) {
	const [, { login }] = React.useContext(User.Context)

	const [state, dispatch] = useMethods(ResetPasswordReducer.reducer, ResetPasswordReducer.initialState)

	const [{ fetching }, resetPassword] = GraphQL.useLazyMutation(`
		mutation ResetPassword($username: String!, $keychain: String!, $newPassword: String!) {
			resetPassword(username: $username, keychain: $keychain, newPassword: $newPassword) {
				...user
			}
		}
		${Fragments.user}
	`)

	const asyncHandleSubmit = async e => {
		e.preventDefault()
		const { username, passcode, lastFour, newPassword } = state
		if (username.length < 3 || username.length > 20) {
			dispatch.setWarn("Username needs to be 3-20 characters.")
			return
		} else if (!testPasscode(passcode)) {
			dispatch.setWarn("Passcode needs to be 4 numbers.")
			return
		} else if (!testPasscode(lastFour)) {
			dispatch.setWarn("Card last four needs to be 4 numbers.")
			return
		} else if (newPassword.length < 8) {
			dispatch.setWarn("Password needs to be 8+ characters.")
			return
		} else if (!testPassword(newPassword)) {
			dispatch.setWarn("Password needs to be a combo of:\n\n- a-z\n- A-Z\n- 0-9\n\n(Spaces are allowed)")
			return
		}
		// Reset password:
		const { errors, data } = await resetPassword({ username, keychain: `${passcode}-${lastFour}`, newPassword })
		if (GraphQL.errorsIs(errors, Errors.SQLNoRows)) {
			dispatch.setWarn("Invalid username and or keychain.")
			return
		} else if (errors) {
			dispatch.setWarn("An unexpected error occurred.")
			return
		}
		// Use `setTimeout` to prevent memory leak:
		setTimeout(() => {
			login(data.resetPassword)
		}, 0)
	}

	return (
		<Overlay>
			<div style={stylex.parse("p-x:32 p-y:128 flex -r -x:center")}>
				<form style={stylex.parse("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex.parse("m-b:40")}>
						<Headers.H1 style={stylex.parse("center")}>
							Reset
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
						Password and card last four
						<Input.KeychainContainer>
							<Input.Keychain
								value={state.passcode}
								onChange={e => dispatch.setPasscode(e.target.value)}
								autoComplete="none"
								spellCheck={false}
							/>
							<Input.Keychain
								value={state.lastFour}
								onChange={e => dispatch.setLastFour(e.target.value)}
								autoComplete="none"
								spellCheck={false}
							/>
						</Input.KeychainContainer>
					</Input.Label>

					<Input.Label style={stylex.parse("m-y:16")}>
						New password
						<Input.Text
							value={state.newPassword}
							onChange={e => dispatch.setNewPassword(e.target.value)}
							autoComplete="new-password"
							spellCheck={false}
						/>
					</Input.Label>

					{state.info && (
						<InputStatus.Info style={stylex.parse("m-t:40 m-b:-24")}>
							{state.info}
						</InputStatus.Info>
					)}

					<Input.Submit style={stylex.parse("m-t:40 m-b:16")} fetching={fetching}>
						Sign in
					</Input.Submit>

					{state.warn && (
						<InputStatus.Warn style={stylex.parse("m-t:16")}>
							{state.warn}
						</InputStatus.Warn>
					)}

				</form>
			</div>
		</Overlay>
	)
}

export default ResetPassword
