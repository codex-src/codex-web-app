import invariant from "invariant"
import React from "react"
import ReactDOM from "react-dom"
import scrollIntoViewIfNeeded from "./scrollIntoViewIfNeeded"
import stylex from "stylex"
import traverseDOM from "./traverseDOM"
import vdom from "./vdom"

import "./editor.css"

// https://github.com/facebook/react/issues/11538#issuecomment-417504600
;(function() {
	if (typeof Node !== "function" || !Node.prototype) {
		// No-op.
		return
	}
	const originalRemoveChild = Node.prototype.removeChild
	Node.prototype.removeChild = function(child) {
		if (child.parentNode !== this) {
			if (console) {
				console.error("Cannot remove a child from a different parent", child, this)
			}
			return child
		}
		return originalRemoveChild.apply(this, arguments)
	}
	const originalInsertBefore = Node.prototype.insertBefore
	Node.prototype.insertBefore = function(newNode, referenceNode) {
		if (referenceNode && referenceNode.parentNode !== this) {
			if (console) {
				console.error("Cannot insert before a reference node from a different parent", referenceNode, this)
			}
			return newNode
		}
		return originalInsertBefore.apply(this, arguments)
	}
})()

function DebugEditor(props) {
	const [state, setState] = React.useState({
		...CodexEditor.state,
		rootNode: undefined,
		touchedNodes: undefined,
	})

	React.useEffect(() => {
		const intervalID = setInterval(() => {
			const _state = {
				...CodexEditor.state,
				rootNode: undefined,
				touchedNodes: undefined,
			}
			setState(_state)
		}, 1e3)
		return () => {
			clearInterval(intervalID)
		}
	}, [])

	return (
		<pre style={stylex.parse("overflow -x:scroll")}>
			<p style={{ ...stylex.parse("fs:12 lh:125%"), MozTabSize: 2, tabSize: 2, fontFamily: "Monaco" }}>
				{JSON.stringify(state, null, "\t")}
			</p>
		</pre>
	)
}

const Paragraph = props => (
	<p data-vdom-node={props._key}>
		{props.children}
	</p>
)

class Editor {
	constructor({ selector, initialValue }) {
		initialValue = initialValue || "" // Zero value.

		this.state = {
			isMounted: false,                  // Is the editor mounted?
			selector,                          // The DOM selector.
			initialValue,                      // The initial plain text data value.
			rootNode:  null,                   // The DOM root node; see `mount`.
			isFocused: false,                  // Is the editor focused?
			body: new vdom.VDOM(initialValue), // The VDOM body.
			pos1: traverseDOM.newPos(),        // The VDOM cursor start.
			pos2: traverseDOM.newPos(),        // The VDOM cursor end.
			// touchedNodes: [],
		}
		// this.mount()
		// -> this.init()
		//    -> this.renderComponents()
		//       -> this.renderCursor()
		this.mount()
	}
	// Mount the editor once the DOM is ready:
	mount() {
		document.addEventListener("DOMContentLoaded", e => {
			const rootNode = document.querySelector(this.state.selector)
			invariant(
				rootNode && rootNode.nodeType && rootNode.nodeType === Node.ELEMENT_NODE,
				"FIXME",
			)
			rootNode.setAttribute("contenteditable", true)
			rootNode.setAttribute("spellcheck", true)
			Object.assign(this.state, {
				isMounted: true,
				rootNode,
			})
			this.init()
		}, false)
	}
	// Initialize the editor once mounted:
	init() {
		this.state.rootNode.addEventListener("focus", e => {
			this.state.isFocused = true
		}, false)
		this.state.rootNode.addEventListener("blur", e => {
			this.state.isFocused = false
		}, false)
		document.addEventListener("selectionchange", e => {
			if (!this.state.isFocused) {
				// No-op.
				return
			}
			console.log("selectionchange")
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			const pos1 = traverseDOM.computePosFromNode(this.state.rootNode, anchorNode, anchorOffset)
			let pos2 = { ...pos1 }
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = traverseDOM.computePosFromNode(this.state.rootNode, focusNode, focusOffset)
			}
			Object.assign(this.state, { pos1, pos2 })
		})
		// this.state.rootNode.addEventListener("compositionstart", e => {
		// 	// ...
		// }, false)
		this.state.rootNode.addEventListener("compositionupdate", e => {
			console.log("compositionupdate", e)
			// const { anchorNode } = document.getSelection()
			// const domNode = traverseDOM.ascendToVDOMNode(anchorNode)
			// const key = domNode.attributes["data-vdom-node"].value
			// const vdomNode = this.state.body.nodes.filter(each => each.key === key)[0]
			// const { pos1, pos2 } = this.state.body._affectedRangeNode(vdomNode.key)
			// this.state.body = this.state.body.write(traverseDOM.innerText(domNode), pos1, pos2)
			// // this.renderComponents()
		}, false)
		this.state.rootNode.addEventListener("compositionend", e => {
			console.log("compositionend", e)
			// const { anchorNode } = document.getSelection()
			// const domNode = traverseDOM.ascendToVDOMNode(anchorNode)
			// const key = domNode.attributes["data-vdom-node"].value
			// const vdomNode = this.state.body.nodes.filter(each => each.key === key)[0]
			// const { pos1, pos2 } = this.state.body._affectedRangeNode(vdomNode.key)
			// this.state.body = this.state.body.write(traverseDOM.innerText(domNode), pos1, pos2)
			// this.renderComponents()
		}, /* false */)
		this.state.rootNode.addEventListener("input", e => {
			console.log("input")
			// if (e.inputType === "insertText") {
			// 	const { anchorNode } = document.getSelection()
			// 	const domNode = traverseDOM.ascendToVDOMNode(anchorNode)
			// 	const key = domNode.attributes["data-vdom-node"].value
			// 	const vdomNode = this.state.body.nodes.filter(each => each.key === key)[0]
			// 	const { pos1, pos2 } = this.state.body._affectedRangeNode(vdomNode.key)
			// 	this.state.body = this.state.body.write(traverseDOM.innerText(domNode), pos1, pos2)
			// 	this.renderComponents()
			// 	return
			// }
		}, false)
		this.renderComponents()
	}
	_computeAffectedVDOMNodeRange() {
		const pos1 = this.state.pos1.pos - this.state.pos1.offset
		const pos2 = this.state.pos1.pos - this.state.pos1.offset + this.state.body.nodes[this.state.pos1.index].data.length
		return { pos1, pos2 }
	}
	_collapse() {
		this.state.pos2 = { ...this.state.pos1 }
	}
	// _write(data, pos1, pos2) {
	// 	this.state.body = this.state.body.write(data, pos1, pos2)
	// 	state.pos1.pos += data.length
	// 	this._collapse()
	// 	// this.renderComponents()
	// }
	// // `opOverwrite` overwrites the current node.
	// opOverwrite(data, pos, shouldRerender) {
	// 	const { pos1, pos2 } = this._computeAffectedVDOMNodeRange()
	// 	this.state.body = this.state.body.write(data, pos1, pos2)
	// 	this.state.pos1 = pos
	// 	this._collapse()
	// 	if (!shouldRerender) {
	// 		// No-op.
	// 		return
	// 	}
	// 	this.renderComponents()
	// }
	renderComponents() {
		// Preserve the cursor:
		if (this.state.isFocused) {
			const { anchorNode, anchorOffset } = document.getSelection()
			this.state.pos1 = traverseDOM.computePosFromNode(this.state.rootNode, anchorNode, anchorOffset)
			this._collapse()
		}
		const components = []
		let index = 0
		while (index < this.state.body.nodes.length) {
			const { key, data } = this.state.body.nodes[index]
			components.push((
				<Paragraph key={key} _key={key}>
					{data || (
						<br />
					)}
				</Paragraph>
			))
			index++
		}
		ReactDOM.render(components, this.state.rootNode)
		this.renderCursor()
	}
	renderCursor() {
		// if (!state.isFocused) {
		// 	// No-op.
		// 	return
		// }
		const range = document.createRange()
		const { node, offset } = traverseDOM.computeNodeFromPos(this.state.rootNode, this.state.pos1.pos, this.state.pos2.pos)
		range.setStart(node, offset)
		range.collapse()
		const selection = document.getSelection()
		selection.removeAllRanges()
		selection.addRange(range)
		// NOTE (1): Use `Math.floor` to mimic Chrome.
		// NOTE (2): Use `... - 1` to prevent jumping.
		const buffer = Math.floor(19 * 1.5) - 1
		scrollIntoViewIfNeeded({ top: buffer, bottom: buffer })
	}
}

const CodexEditor = new Editor({
	selector: "[data-codex-editor]",
	initialValue: `aa

cc`,
})

const _Editor = props => (
	<div>
		<article data-codex-editor />
		<div style={stylex.parse("h:28")} />
		<DebugEditor />
	</div>
)

export default _Editor
