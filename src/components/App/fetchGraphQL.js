// https://github.com/codex-src/use-graphql.js/blob/master/src/TodosApp/fetchGraphQL.js
async function fetchGraphQL(query, variables = {}) {
	const res = await fetch("http://localhost:8000/graphql", {
		method: "POST",
		headers: { "Content-Type": "application/json"	},
		credentials: "include", // Needed for CORS.
		body: JSON.stringify({
			query,     // The GraphQL query.
			variables, // The GraphQL variables.
		}),
	})
	return await res.json()
}

export default fetchGraphQL
