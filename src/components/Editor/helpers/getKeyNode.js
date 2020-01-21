// <div>
//   <div data-node> <-
//     ...
//   </div>
// <div>
//
export function getKeyNode(node) {
	while (node) {
		if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute("data-node")) {
			break
		}
		node = node.parentNode
	}
	return node
}

// <div>
//   <div data-compound-node> <-
//     <div data-node>
//       ...
//     </div>
//   </div>
// <div>
//
export function getCompoundKeyNode(rootNode, node) {
	while (node) {
		if (node.parentNode === rootNode) {
			break
		}
		node = node.parentNode
	}
	return node
}
