import React from "react"

export const cardOptions = {
	pubKey: "pk_test_TYooMQauvdEDq54NiTphI7jx", // FIXME
	mount: "#card-element",
	style: {
		base: {
			fontSmoothing: "antialiased",
			fontSize: "16px",
			fontFamily: "'BlinkMacSystemFont', 'system-ui', '-apple-system'",
			color: "#212121",
			"::placeholder": {
				color: "#9E9E9E",
			},
		},
	},
}

export function useCard(options) {
	const [createToken, setCreateToken] = React.useState(null)
	React.useEffect(
		React.useCallback(() => {
			const StripeAPI = window.Stripe(options.pubKey)
			const card = StripeAPI.elements().create("card", { style: options.style })
			card.mount(options.mount)
			// NOTE: Return a function that returns a function
			// because of `useEffect`.
			setCreateToken(() => {
				return () => StripeAPI.createToken(card)
			})
		}, [options]),
		[],
	)
	return createToken
}
