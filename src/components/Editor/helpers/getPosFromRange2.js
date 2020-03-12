// Gets the cursor from a range. Code based on innerText.
function getPosFromRange2(rootNode, node, offset) {
	const pos = {
		x: 0,   // The character index (of the current paragraph)
		y: 0,   // The paragraph index
		pos: 0, // The cursor position
	}

	// NOTE: Gecko/Firefox can select the end element node
	if (node.nodeType === Node.ELEMENT_NODE && offset && !(offset < node.childNodes.length)) {
		// return getPosFromRange2(rootNode, null, 0)
		node = null
		offset = 0
	}

	let walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, null, false);

	while(walker.nextNode()){
		var cur = walker.currentNode;
		if(cur.nodeType === Node.ELEMENT_NODE &&
			(cur.hasAttribute("data-node") || cur.hasAttribute("data-compound-node"))
		) {
			pos.x = 0;
			if(pos.pos !== 0){
				pos.y += 1;
				pos.pos += 1;
			}
		}

		if(cur === node) {
			pos.x += offset;
			pos.pos += offset;
			return pos;
		}

		if(cur.nodeValue){
			const len = cur.nodeValue.length;
			pos.x += len;
			pos.pos += len;
		}
	}

	return pos
}

export default getPosFromRange2
