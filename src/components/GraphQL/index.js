import * as constants from "__constants"

// NOTE: Do not use export default for now
export async function newQuery(idToken, query, variables = {}) {
	const response = await fetch(constants.URL_PRIVATE_API, {
		method: "POST",
		credentials: "include", // TODO: Needed for production?
		headers: {
			...(idToken && { Authorization: `Bearer ${idToken}` }),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	})
	const body = await response.json()
	if (body.errors) {
		throw new Error(JSON.stringify(body.errors))
	}
	return body
}
