import historyReducer from "./historyReducer"
import operationsReducer from "./operationsReducer"
import OperationTypes from "./OperationTypes"
import renderReducer from "./renderReducer"
import setStateReducer from "./setStateReducer"
import useMethods from "use-methods"
import VDOM from "../data-structures/VDOM"
import { parseComponents } from "../components/Markdown"
import { VDOMCursor } from "../data-structures/VDOMCursor"

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
	...historyReducer(state),
	...operationsReducer(state),
	...renderReducer(state),
	...setStateReducer(state),
})

// `init` returns a function to an initializer function.
const init = initialValue => initialState => {
	const { /* body, */ pos1, pos2 } = initialState
	const body = new VDOM(initialValue)      // Temporary fix.
	const Components = parseComponents(body) // Temporary fix.
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
