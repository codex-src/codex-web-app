import history from "./history"
import operations from "./operations"
import OperationTypes from "./OperationTypes"
import render from "./render"
import setState from "./setState"
import useMethods from "use-methods"
import VDOM from "../VDOM"
import { parseComponents } from "../Components/Markdown"
import { VDOMCursor } from "../traverseDOM"

const initialState = {
	op:           OperationTypes.INIT,
	opTimestamp:  0,
	hasFocus:     false,
	body:         new VDOM(""),
	pos1:         new VDOMCursor(),
	pos2:         new VDOMCursor(),
	Components:   [],
	didWritePos:  false,
	history:      [],
	historyIndex: -1,

	// `shouldRender` hints whether to render; uses a counter
	// to track the number of renders.
	shouldRender: 0,

	// `shouldRenderDOMCursor` hints whether to render the DOM
	// cursor; uses a counter to track the number of renders.
	shouldRenderDOMCursor: 0,

	reactDOM: document.createElement("div"),
}

const reducer = state => ({
	   ...history(state), // eslint-disable-line
	...operations(state), // eslint-disable-line
	    ...render(state), // eslint-disable-line
	  ...setState(state), // eslint-disable-line
})

// `init` returns a function to an initializer function so
// that `initialValue` can be passed as an argument.
const init = initialValue => initialState => {
	let { body, pos1, pos2 } = initialState
	body = body.write(initialValue, 0, body.data.length)
	const Components = parseComponents(body)
	const state = {
		...initialState,
		body,
		Components,
		history: [{ body, pos1: pos1.newReference(), pos2: pos2.newReference() }],
		historyIndex: 0,
	}
	return state
}

function useEditor(initialValue = "") {
	return useMethods(reducer, initialState, init(initialValue))
}

export default useEditor
