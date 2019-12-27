import * as equality from "./equality"

// `nodeValue` reads a text node.
export function nodeValue(node) {
	if (!node.nodeValue) {
		return ""
	}
	return node.nodeValue
}

// `innerText` recursively reads a root node.
export function innerText(root) {
	let data = ""
	const recurse = start => {
		for (const each of start.childNodes) {
			if (equality.isTextNode(each)) {
				data += nodeValue(each)
			} else {
				recurse(each)
				if (equality.isVDOMNode(each) && each.nextSibling) {
					data += "\n"
				}
			}
		}
	}
	recurse(root)
	return data
}
