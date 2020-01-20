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
					start === end &&
					nodes[end].data.length >= 3 &&
					nodes[end].data.slice(-3) === "```"
				)
				// B:
				//
				// ```
				// code
				// ```
				const matchesB = (
					start !== end &&
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

// Hello, world!                 //  0
//                               //  1
// ```go                         //  2
// package main                  //  3
//                               //  4
// import "fmt"                  //  5
//                               //  6
// func main() {                 //  7
// 	fmt.Println("hello, world!") //  8
// }                             //  9
// ```                           // 10
//                               // 11
// Hello, world!                 // 12

test("code block", () => {
	const data = `Hello, world!

\`\`\`fmt.Println("hello, world!")\`\`\`

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 5, end: 5 })
})

test("unterminated code block (1 of 2)", () => {
	const data = `Hello, world!

\`\`\`fmt.Println("hello, world!")

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 2, end: 5 })
})

test("unterminated code block (2 of 2)", () => {
	const data = `Hello, world!

fmt.Println("hello, world!")\`\`\`

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 5, end: 5 })
})

test("multiline code block", () => {
	const data = `Hello, world!

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}
\`\`\`

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 13, end: 13 })
})

test("unterminated multiline code block (1 of 2)", () => {
	const data = `Hello, world!

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 2, end: 12 })
})

test("unterminated multiline code block (2 of 2)", () => {
	const data = `Hello, world!

package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}
\`\`\`

Hello, world!`
	const nodes = newNodes(data)
	expect(getUnterminatedCodeBlockRange(nodes)).toStrictEqual({ start: 12, end: 12 })
})
