import React from "react"
import RenderDOM from "lib/RenderDOM"

import {
	newDOMResolver,
	newDOMResolverInfo,
} from "../DOMResolver"

const ATTRIBUTE = "unix"

function resolveOn(root1, root2) {
	let info1 = newDOMResolverInfo(root1, ATTRIBUTE)
	let info2 = newDOMResolverInfo(root2, ATTRIBUTE)
	const resolvers = newDOMResolver(info1, info2, ATTRIBUTE)
	for (const { type, node, newNode } of resolvers) {
		if (type === "UPDATE") {
			node.node.replaceWith(newNode.node.cloneNode(true))
		} else if (type === "DELETE") {
			node.node.remove()
		} else if (type === "INSERT") {
			root1.insertBefore(newNode.node.cloneNode(true), root1.childNodes[newNode.index])
		}
	}
	console.log(root1.outerHTML)
	console.log(root2.outerHTML)
	expect(root1.outerHTML).toBe(root2.outerHTML)
}

// // -  -> -
// //
// // -  -> a
// //
// // a  -> -
// //
// // a  -> a
// //
// describe("group 1", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a1 -> a0
// //
// // a1 -> a1
// //
// // a1 -> a2
// //
// describe("group 2", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={0} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={2} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a1 -> b0
// //
// // a1 -> b1
// //
// // a1 -> b2
// //
// describe("group 3", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="b" unix={0} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="b" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="b" unix={2} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // -  -> -
// //
// // -  -> a
// //
// // -  -> a
// //    -> b
// //
// // -  -> a
// //    -> b
// //    -> c
// //
// describe("group 4", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // -  -> -
// //
// // a  -> -
// //
// // a  -> -
// // b
// //
// // a  -> -
// // b
// // c
// //
// describe("group 4 (reversed)", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				{/* ... */}
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a  -> a
// //       b
// //       c
// //
// // b  -> a
// //       b
// //       c
// //
// // c  -> a
// //       b
// //       c
// //
// describe("group 5", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="b" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a  -> a
// // b
// // c
// //
// // a  -> b
// // b
// // c
// //
// // a  -> c
// // b
// // c
// //
// describe("group 5 (reversed)", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="b" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a  -> d
// // b     e
// // c     f
// //
// // d  -> a
// // e     b
// // f     c
// //
// describe("group 6", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="d" unix={1} />
// 				<div id="e" unix={1} />
// 				<div id="f" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="d" unix={1} />
// 				<div id="e" unix={1} />
// 				<div id="f" unix={1} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={1} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={1} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })
//
// // a0 -> x0
// // b1    y1
// // c2    z2
// // x0    a0
// // y1    b1
// // z2    c2
// //
// // x0 -> a0
// // y1    b1
// // z2    c2
// // a0    x0
// // b1    y1
// // c2    z2
// //
// describe("group 7", () => {
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="a" unix={0} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={2} />
// 				<div id="x" unix={0} />
// 				<div id="y" unix={1} />
// 				<div id="z" unix={2} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="x" unix={0} />
// 				<div id="y" unix={1} />
// 				<div id="z" unix={2} />
// 				<div id="a" unix={0} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={2} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// 	test("", () => {
// 		const Root1 = props => (
// 			<div>
// 				<div id="x" unix={0} />
// 				<div id="y" unix={1} />
// 				<div id="z" unix={2} />
// 				<div id="a" unix={0} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={2} />
// 			</div>
// 		)
// 		const Root2 = props => (
// 			<div>
// 				<div id="a" unix={0} />
// 				<div id="b" unix={1} />
// 				<div id="c" unix={2} />
// 				<div id="x" unix={0} />
// 				<div id="y" unix={1} />
// 				<div id="z" unix={2} />
// 			</div>
// 		)
// 		const root1 = RenderDOM(Root1)
// 		const root2 = RenderDOM(Root2)
// 		resolveOn(root1, root2)
// 	})
// })

// a0 -> x2
// b1    y1
// c2    z0
// x0    a2
// y1    b1
// z2    c0
//
// x2 -> a0
// y1    b1
// z0    c2
// a2    x0
// b1    y1
// c0    z2
//
describe("group 8", () => {
	// test("", () => {
	// 	const Root1 = props => (
	// 		<div>
	// 			<div id="a" unix={0} />
	// 			<div id="b" unix={1} />
	// 			<div id="c" unix={2} />
	// 			<div id="x" unix={0} />
	// 			<div id="y" unix={1} />
	// 			<div id="z" unix={2} />
	// 		</div>
	// 	)
	// 	const Root2 = props => (
	// 		<div>
	// 			<div id="x" unix={2} />
	// 			<div id="y" unix={1} />
	// 			<div id="z" unix={0} />
	// 			<div id="a" unix={2} />
	// 			<div id="b" unix={1} />
	// 			<div id="c" unix={0} />
	// 		</div>
	// 	)
	// 	const root1 = RenderDOM(Root1)
	// 	const root2 = RenderDOM(Root2)
	// 	resolveOn(root1, root2)
	// })
	test("", () => {
		const Root1 = props => (
			<div>
				<div id="x" unix={2} />
				<div id="y" unix={1} />
				<div id="z" unix={0} />
				<div id="a" unix={2} />
				<div id="b" unix={1} />
				<div id="c" unix={0} />
			</div>
		)
		const Root2 = props => (
			<div>
				<div id="a" unix={0} />
				<div id="b" unix={1} />
				<div id="c" unix={2} />
				<div id="x" unix={0} />
				<div id="y" unix={1} />
				<div id="z" unix={2} />
			</div>
		)
		const root1 = RenderDOM(Root1)
		const root2 = RenderDOM(Root2)
		resolveOn(root1, root2)
	})
})
