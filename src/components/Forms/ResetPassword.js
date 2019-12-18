/* eslint-disable no-multi-spaces */
import * as ResetPasswordReducer from "./ResetPasswordReducer"

import Errors       from "components/Errors"
import Fragments    from "components/Fragments"
import GraphQL      from "use-graphql"
import Headers      from "components/Headers"
import Inputs       from "components/Inputs"
import Overlay      from "components/Overlay"
import React        from "react"
import Status       from "components/Status"
import stylex       from "stylex"
import testPasscode from "./helpers/testPasscode"
import testPassword from "./helpers/testPassword"
import useMethods   from "use-methods"
import User         from "components/User"
/* eslint-enable no-multi-spaces */

function ResetPassword(props) {
	const [, { login }] = React.useContext(User.Context)

	const [state, dispatch] = useMethods(ResetPasswordReducer.reducer, ResetPasswordReducer.initialState)

	const [{ fetching }, resetPassword] = GraphQL.useLazyMutation(`
		mutation ResetPassword($username: String!, $keychain: String!, $newPassword: String!) {
			resetPassword(username: $username, keychain: $keychain, newPassword: $newPassword) {
				...userFields
			}
		}
		${Fragments.userFields}
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
		login(data.resetPassword)
	}

	return (
		<Overlay>
			<div style={stylex("p-x:32 p-y:128 flex -r -x:center")}>
				<form style={stylex("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex("m-b:40")}>
						<Headers.H1 style={stylex("center")}>
							Reset
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
							autoComplete="current-username"
							spellCheck={false}
						/>
					</Inputs.Label>

					<Inputs.Label style={stylex("m-y:16")}>
						Password and card last four
						<Inputs.KeychainContainer>
							<Inputs.Keychain
								value={state.passcode}
								onChange={e => dispatch.setPasscode(e.target.value)}
								autoComplete="none"
								spellCheck={false}
							/>
							<Inputs.Keychain
								value={state.lastFour}
								onChange={e => dispatch.setLastFour(e.target.value)}
								autoComplete="none"
								spellCheck={false}
							/>
						</Inputs.KeychainContainer>
					</Inputs.Label>

					<Inputs.Label style={stylex("m-y:16")}>
						New password
						<Inputs.Text
							value={state.newPassword}
							onChange={e => dispatch.setNewPassword(e.target.value)}
							autoComplete="new-password"
							spellCheck={false}
						/>
					</Inputs.Label>

					{state.info && (
						<Status.Info style={stylex("m-t:40 m-b:-24")}>
							{state.info}
						</Status.Info>
					)}

					<Inputs.Submit style={stylex("m-t:40 m-b:16")} fetching={fetching}>
						Sign in
					</Inputs.Submit>

					{state.warn && (
						<Status.Warn style={stylex("m-t:16")}>
							{state.warn}
						</Status.Warn>
					)}

				</form>
			</div>
		</Overlay>
	)
}

export default ResetPassword
