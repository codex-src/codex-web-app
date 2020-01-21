import React from "react"
import RenderDOM2 from "utils/RenderDOM2"

// Compares whether two DOM trees are equal -- root nodes
// are not compared (because of data-memo).
function areEqualTrees(treeA, treeB) {
	if (treeA.childNodes.length !== treeB.childNodes.length) {
		return false
	}
	// Iterate child nodes; lengths are the same:
	let index = 0
	const { length } = treeA.childNodes
	while (index < length) {
		if (!treeA.childNodes[index].isEqualNode(treeB.childNodes[index])) {
			return false
		}
		if (treeA.childNodes[index].childNodes || treeB.childNodes[index].childNodes) {
			if (!areEqualTrees(treeA.childNodes[index], treeB.childNodes[index])) {
				return false
			}
		}
		index++
	}
	return true
}

describe("group 1", () => {
	test("", () => {
		const Component1 = props => (
			<div memo={0}>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div memo={1}>
				{/* ... */}
			</div>
		)
		const rootNode1 = RenderDOM2(<Component1 />)
		const rootNode2 = RenderDOM2(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
})

describe("group 2", () => {
	// NOTE: Use {" "} to create three text nodes.
	test("", () => {
		const Component1 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const Component2 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const rootNode1 = RenderDOM2(<Component1 />)
		const rootNode2 = RenderDOM2(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const Component2 = props => (
			<div>
				Hello,{" "}
				darkness…
			</div>
		)
		const rootNode1 = RenderDOM2(<Component1 />)
		const rootNode2 = RenderDOM2(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(false)
	})
})

describe("group 3", () => {
	test("", () => {
		const Component1 = props => (
			<div>
				<em>
					Hello
				</em>
				{", "}
				<strong>
					world
				</strong>
				!
			</div>
		)
		const Component2 = props => (
			<div>
				<em>
					Hello
				</em>
				{", "}
				<strong>
					world
				</strong>
				!
			</div>
		)
		const rootNode1 = RenderDOM2(<Component1 />)
		const rootNode2 = RenderDOM2(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<em>
					Hello
				</em>
				{", "}
				<strong>
					world
				</strong>
				!
			</div>
		)
		const Component2 = props => (
			<div>
				<em>
					Hello
				</em>
				{", "}
				<strong>
					darkness
				</strong>
				…
			</div>
		)
		const rootNode1 = RenderDOM2(<Component1 />)
		const rootNode2 = RenderDOM2(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(false)
	})
})
