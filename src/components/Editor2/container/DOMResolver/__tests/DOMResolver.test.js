import rand from "lib/random/id"
import React from "react"
import RenderDOM from "lib/RenderDOM"

import {
	newDOMResolver,
	newDOMResolverInfo,
} from "../DOMResolver"

const a = rand.newSevenByteHash()
const b = rand.newSevenByteHash()
const c = rand.newSevenByteHash()
const d = rand.newSevenByteHash()
const e = rand.newSevenByteHash()
const f = rand.newSevenByteHash()
const g = rand.newSevenByteHash()
const h = rand.newSevenByteHash()

test("integration", () => {
	const Component1 = props => (
		<div>
			<div id={a} data-vdom-node data-vdom-unix={1} />
			<div id={b} data-vdom-node data-vdom-unix={1} />
			<div id={c} data-vdom-node data-vdom-unix={1} />
			<div id={d} data-vdom-node data-vdom-unix={1} />
		</div>
	)
	const Component2 = props => (
		<div>
			<div id={a} data-vdom-node data-vdom-unix={1} />
			<div id={b} data-vdom-node data-vdom-unix={1} />
			<div id={c} data-vdom-node data-vdom-unix={1} />
			<div id={d} data-vdom-node data-vdom-unix={1} />
			<div id={e} data-vdom-node data-vdom-unix={1} />
		</div>
	)
	const rootNode = RenderDOM(Component1)
	const newRootNode = RenderDOM(Component2)

	const rootNodeInfo = newDOMResolverInfo(rootNode)
	const newRootNodeInfo = newDOMResolverInfo(newRootNode)
	const resolvers = newDOMResolver(rootNodeInfo, newRootNodeInfo)
	console.log(resolvers)

	for (const resolver of resolvers) {
		switch (resolver.type) {
		case "UPDATE":
			resolver.node.node.replaceWith(resolver.newNode.node.cloneNode(true))
			break
		case "DELETE":
			resolver.node.node.remove()
			break
		case "INSERT":
			rootNode.insertBefore(resolver.newNode.node.cloneNode(true), rootNode.childNodes[resolver.newNode.index])
			break
		default:
			// (No-op)
			break
		}
	}

	const rootNodeInfo2 = newDOMResolverInfo(rootNode)
	const newRootNodeInfo2 = newDOMResolverInfo(newRootNode)
	const resolvers2 = newDOMResolver(rootNodeInfo2, newRootNodeInfo2)
	console.log(resolvers2)
})

// Test cases:
//
// -  -
// -  a
// a  -
//
// a1 a0
// a1 a1
// a1 a2
//
// a1 b0
// a1 b1
// a1 b2
//
// -  a
//
// -  a
//    a
//
// -  a
//    a
//    a
//
// a  -
//
// a  -
// a
//
// a  -
// a
// a
//
// a  a
//    b
//    c
//
// b  a
//    b
//    c
//
// c  a
//    b
//    c
//
// a  a
// b
// c
//
// a  b
// b
// c
//
// a c
// b
// c
//
// a  d
// b  e
// c  f
//
// d  a
// e  b
// f  c
//
// a  x
// b  y
// c  z
// x  a
// y  b
// z  c
//
// x  a
// y  b
// z  c
// a  x
// b  y
// c  z
//
// a1 x2
// b1 y2
// c1 z2
// x1 a2
// y1 b2
// z1 c2
//
// a2 x1
// b2 y1
// c2 z1
// x2 a1
// y2 b1
// z2 c1
