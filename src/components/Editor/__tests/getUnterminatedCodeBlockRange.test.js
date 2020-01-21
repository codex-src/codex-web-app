import random from "utils/random/id"

// Creates new nodes from plain text data.
function newNodes(data) {
	const nodes = []
	const arr = data.split("\n")
	for (const each of arr) {
		nodes.push({
			key: random.newUUID(), // The key (for React)
			data: each,            // The plain text data
		})
	}
	return nodes
}

// Gets the range of the first unterminated code block.
function getUnterminatedCodeBlockRange(nodes) {
	let start = 0
	let end = 0
	while (start < nodes.length && end < nodes.length) {
		if (nodes[start].data.length >= 3 && nodes[start].data.slice(0, 3) === "```") {
			while (end < nodes.length) {
				// A:
				//
				// ```code```
				const matchesA = (
					end === start &&
					nodes[end].data.length >= 3 &&
					nodes[end].data.slice(-3) === "```"
				)
				// B:
				//
				// ```
				// code
				// ```
				const matchesB = (
					end !== start &&
					nodes[end].data.length === 3 &&
					nodes[end].data === "```"
				)
				if (matchesA || matchesB) {
					end++ // Reverse order
					start = end
					break
				}
				end++
			}
			continue // XOR
		}
		start++
		end = start
	}
	return { start, end }
}

test("single line", () => {
	const data = `text

\`\`\`code\`\`\`

\`\`\`code\`\`\`

text`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 7, end: 7 })
})

test("unterminated single line", () => {
	const data = `text

\`\`\`code

\`\`\`code

text`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 2, end: 7 })
})

test("multiline", () => {
	const data = `text

\`\`\`
code
\`\`\`

\`\`\`
code
\`\`\`

text`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 11, end: 11 })
})

test("unterminated multiline", () => {
	const data = `text

\`\`\`
code

\`\`\`
code

text`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 9, end: 9 })
})

test("unterminated multiline with language descriptor", () => {
	const data = `text

\`\`\`lang
code

\`\`\`lang
code

text`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 2, end: 9 })
})
