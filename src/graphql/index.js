// TODO: Add function-wrapper in User.js to bind
// authBearerToken
//
// "http://localhost:8080/graphql"
export async function query(authBearerToken, query, variables = {}) {
	const response = await fetch("https://api.opencodex.dev/graphql", {
		method: "POST",
		headers: {
			...(authBearerToken && { Authorization: `Bearer ${authBearerToken}` }),
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
// TODO: Add function-wrapper in User.js to bind
// authBearerToken
//
// "http://localhost:8080/graphql"
export async function mutate(authBearerToken, mutation, variables = {}) {
	const response = await fetch("https://api.opencodex.dev/graphql", {
		method: "POST",
		headers: {
			...(authBearerToken && { Authorization: `Bearer ${authBearerToken}` }),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			mutation,
			variables,
		}),
	})
	const body = await response.json()
	if (body.errors) {
		throw new Error(JSON.stringify(body.errors))
	}
	return body
}
