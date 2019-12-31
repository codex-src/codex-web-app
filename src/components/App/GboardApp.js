import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

const GboardApp = props => (
	<div style={stylex.parse("p-x:24 p-y:32")}>
		<Editor.Editor />
	</div>
)

// // https://github.com/facebook/react/issues/11538#issuecomment-417504600
// ;(function() {
// 	if (typeof Node === "function" && Node.prototype) {
// 		const originalRemoveChild = Node.prototype.removeChild
// 		Node.prototype.removeChild = function(child) {
// 			if (child.parentNode !== this) {
// 				if (console) {
// 					console.error("Cannot remove a child from a different parent", child, this)
// 				}
// 				return child
// 			}
// 			return originalRemoveChild.apply(this, arguments)
// 		}
//
// 		const originalInsertBefore = Node.prototype.insertBefore
// 		Node.prototype.insertBefore = function(newNode, referenceNode) {
// 			if (referenceNode && referenceNode.parentNode !== this) {
// 				if (console) {
// 					console.error("Cannot insert before a reference node from a different parent", referenceNode, this)
// 				}
// 				return newNode
// 			}
// 			return originalInsertBefore.apply(this, arguments)
// 		}
// 	}
// })()
//
// function GboardApp(props) {
// 	const [state, setState] = React.useState("hello, world!")
//
// 	return (
// 		<div style={stylex.parse("p-x:24 p-y:32")}>
// 			{React.createElement(
// 				"article",
// 				{
// 					contentEditable: true,
// 					suppressContentEditableWarning: true,
//
// 					onBeforeInput: e => {
// 						e.preventDefault()
// 						console.log({ ...e })
// 					}
// 				},
// 				state,
// 			)}
// 		</div>
// 	)
// }

export default GboardApp
