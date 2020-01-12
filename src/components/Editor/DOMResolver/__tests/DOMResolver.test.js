import React from "react"
import RenderDOM from "lib/RenderDOM"

import {
	newDOMInfo,
	newDOMResolver,
} from "../DOMResolver"

// // TODO
// test("integration", () => {
// 	// (Current)
// 	const Component1 = props => (
// 		<div>
// 			<div id="a" data-vdom-node data-vdom-unix={1} />
// 			<div id="b" data-vdom-node data-vdom-unix={1} />
// 			<div id="c" data-vdom-node data-vdom-unix={1} />
// 			<div id="d" data-vdom-node data-vdom-unix={1} />
// 		</div>
// 	)
// 	// (Next)
// 	const Component2 = props => (
// 		<div>
// 			<div id="a" data-vdom-node data-vdom-unix={1} />
// 			<div id="b" data-vdom-node data-vdom-unix={1} />
// 			<div id="c" data-vdom-node data-vdom-unix={1} />
// 			<div id="d" data-vdom-node data-vdom-unix={1} />
// 			<div id="d" data-vdom-node data-vdom-unix={1} />
// 			<div id="e" data-vdom-node data-vdom-unix={1} />
// 			<div id="f" data-vdom-node data-vdom-unix={1} />
// 			<div id="g" data-vdom-node data-vdom-unix={1} />
// 		</div>
// 	)
// 	const curr = newDOMInfo(RenderDOM(Component1))
// 	const next = newDOMInfo(RenderDOM(Component2))
// 	console.log(newDOMResolver(curr, next))
// })
