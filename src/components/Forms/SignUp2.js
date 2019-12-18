/* eslint-disable no-multi-spaces */
import * as Stripe from "./Stripe"

import Fragments from "components/Fragments"
import GraphQL   from "use-graphql"
import Headers   from "components/Headers"
import Input     from "components/Input"
import invariant from "invariant"
import Overlay   from "components/Overlay"
import React     from "react"
import Status    from "components/Status"
import stylex    from "stylex"
import User      from "components/User"
/* eslint-enable no-multi-spaces */

function SignUpBilling({ state, dispatch, ...props }) {
	const [, { login }] = React.useContext(User.Context)

	const createToken = Stripe.useCard(Stripe.cardOptions)

	const [, createUser] = GraphQL.useLazyMutation(`
		mutation CreateUser($user: CreateUserInput!) {
			createUser(user: $user) {
				...user
			}
		}
		${Fragments.user}
	`)

	React.useEffect(
		React.useCallback(() => {
			(async () => {
				const { errors, data } = await GraphQL.fetchAsGraphQL(`
					query NextSubscriptionDate {
						nextMo: nextMonth { ...date }
						nextYr: nextYear  { ...date }
					}
					${Fragments.date}
				`)
				if (errors) {
					invariant(false, errors.map(error => error.message).join(", "))
					return
				}
				dispatch.setNextMo(data.nextMo)
				dispatch.setNextYr(data.nextYr)
			})()
		}, [dispatch]),
		[],
	)

	const asyncHandleSubmit = async e => {
		e.preventDefault()
		const { username, password, passcode, chargeMonth } = state
		if (chargeMonth === -1) {
			dispatch.setWarn("Please choose a subscription.")
			return
		}
		// Create token:
		dispatch.setFetching(true)
		const res1 = await createToken()
		if (res1.error) { // Not a GraphQL error.
			dispatch.setFetching(false)
			dispatch.setWarn(res1.error.message)
			return
		}
		const { card: { id: stripeCardID, brand: stripeCardBrand, last4: stripeCardLastFour } } = res1.token
		if (!stripeCardID || !stripeCardBrand || !stripeCardLastFour) {
			dispatch.setFetching(false)
			dispatch.setWarn("An unexpected error occurred.\n\n(You were not charged)")
			return
		}
		// Create user:
		const res2 = await createUser({ user: { username, password, passcode, chargeMonth: chargeMonth === 1, stripeCardID, stripeCardBrand, stripeCardLastFour } })
		if (res2.errors) {
			dispatch.setFetching(false)
			dispatch.setWarn("An unexpected error occurred.")
			return
		}
		login(res2.data.createUser)
	}

	return (
		<Overlay>
			<div style={stylex("p-x:32 p-y:128 flex -r -x:center")}>
				<form style={stylex("w:320")} onSubmit={asyncHandleSubmit}>

					<header style={stylex("m-b:40")}>
						<Headers.H1 style={stylex("center")}>
							Sign up
						</Headers.H1>
						<Headers.H2 style={stylex("center")}>
							to continue with <span style={stylex("c:blue-a400")}>Codex</span>
						</Headers.H2>
					</header>

					<Input.Label style={stylex("m-y:16")}>
						Subscription
						<Input.SubscriptionSelect>
							<Input.SubscriptionOption
								selected={state.chargeMonth === 1}
								text="Charge me per month"
								price="$8 per month"
								onClick={dispatch.setChargeMo}
							/>
							<Input.SubscriptionOption
								selected={state.chargeMonth === 0}
								text="Charge me per year"
								price="$80 per year"
								discount="SAVE 20%"
								onClick={dispatch.setChargeYr}
							/>
						</Input.SubscriptionSelect>
					</Input.Label>

					<Input.Label style={stylex("m-y:32")}>
						Payment method
						<Input.StripeCard />
					</Input.Label>

					{state.info && (
						<Status.Info style={stylex("m-t:40 m-b:-24")}>
							{state.info}
						</Status.Info>
					)}

					<Input.Submit style={stylex("m-t:40 m-b:16")} fetching={state.fetching}>
						Sign up now
					</Input.Submit>

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

export default SignUpBilling
