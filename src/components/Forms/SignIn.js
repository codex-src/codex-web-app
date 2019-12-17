import * as SignInReducer from "./SignInReducer"
import Errors from "components/Errors"
import Feather from "components/Feather"
import Fragments from "components/Fragments"
import GraphQL from "use-graphql"
import Input from "components/Input"
import Overlay from "components/Overlay"
import React from "react"
import Status from "components/Status"
import stylex from "stylex"
import UI from "components/UI"
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
		login(data.createSession)
	}

	return (
		<Overlay>
			<div style={stylex("p-x:32 p-y:128 flex -r -x:center")}>
				<div style={stylex("w:320")}>
					<form onSubmit={asyncHandleSubmit}>

						<header style={stylex("m-b:40")}>
							<UI.StyledH1 style={stylex("center")}>
								Sign in
							</UI.StyledH1>
							<UI.StyledH2 style={stylex("center")}>
								to continue with <span style={stylex("c:blue-a400")}>Codex</span>
							</UI.StyledH2>
						</header>

						<Input.Label style={stylex("m-y:16")}>
							Username
							<Input.Text
								value={state.username}
								onChange={e => dispatch.setUsername(e.target.value)}
								autoComplete="current-username"
							/>
						</Input.Label>

						<Input.Label style={stylex("m-y:16")}>
							Password
							<Input.WithShow show={state.show} setShow={dispatch.setShow}>
								<Input.Password
									value={state.password}
									onChange={e => dispatch.setPassword(e.target.value)}
									autoComplete="current-password"
								/>
							</Input.WithShow>
						</Input.Label>

						{state.info && (
							<Status.Info style={stylex("m-t:40 m-b:-24")}>
								{state.info}
							</Status.Info>
						)}

						<Input.Submit style={stylex("m-t:40 m-b:16")}>
							{!fetching ? (
								"Sign in"
							) : (
								"Loading…"
							)}
						</Input.Submit>

						{!state.warn ? (
							<Input.Nevermind style={stylex("m-t:-16")} to="/reset-password">
								I forgot my password
							</Input.Nevermind>
						) : (
							<Status.Warn style={stylex("m-t:16")}>
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

// <UI.Overlay>
// 	<div style={stylex("flex -r -x:center")}>
// 		<form style={stylex("m-y:128 w:320")} onSubmit={asyncHandleSubmit}>
//
// 			<header style={stylex("m-b:40")}>
// 				<UI.StyledH1 style={stylex("center")}>
// 					Sign in
// 				</UI.StyledH1>
// 				<UI.StyledH2 style={stylex("center")}>
// 					to continue with <span style={stylex("c:blue-a400")}>Codex</span>
// 				</UI.StyledH2>
// 			</header>
//
// 		<UI.Label style={stylex("m-y:16")}>
// 			Username
// 			<UI.InputText
// 				value={state.username}
// 				autoComplete="current-username"
// 				onChange={e => dispatch.setUsername(e.target.value)}
// 			/>
// 		</UI.Label>
//
// 		<UI.Label style={stylex("m-y:16")}>
// 			Password
// 			<UI.InputPassword
// 				show={state.show}
// 				setShow={dispatch.setShow}
// 				value={state.password}
// 				autoComplete="current-password"
// 				onChange={e => dispatch.setPassword(e.target.value)}
// 			/>
// 		</UI.Label>
//
// 		{state.info && (
// 			<UI.StatusInfo style={stylex("m-t:40 m-b:-24")}>
// 				{state.info}
// 			</UI.StatusInfo>
// 		)}
//
// 		<UI.InputSubmit style={stylex("m-t:40 m-b:16")}>
// 			{!fetching ? (
// 				"Sign in"
// 			) : (
// 				"Loading…"
// 			)}
// 		</UI.InputSubmit>
//
// 		{!state.warn ? (
// 			<UI.InputSubmitAlternate style={stylex("m-t:-16")} to="/reset-password">
// 				I forgot my password
// 			</UI.InputSubmitAlternate>
// 		) : (
// 			<UI.StatusWarn style={stylex("m-t:16")}>
// 				{state.warn}
// 			</UI.StatusWarn>
// 		)}
//
// 		</form>
// 	</div>
// </UI.Overlay>
