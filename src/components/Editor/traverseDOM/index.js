import * as traverseDOM from "./traverseDOM"
import * as types from "./types"
import nodeMethods from "./nodeMethods"

const exports = {
	...traverseDOM,
	...types,
	...nodeMethods,
}

export default exports
