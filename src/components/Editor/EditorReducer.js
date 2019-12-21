import parse from "./Components"
import useMethods from "use-methods"

// FIXME: `pos1` and `pos2`.
const initialState = {
	isFocused:  false,     // Is the editor focused?
	data:       "",        // What’s the editor’s data?
	pos1:       0,         // What’s the editor’s cursor start position?
	pos2:       0,         // What’s the editor’s cursor end position?
	Components: parse(""), // What’s are the editor’s components.
}

const reducer = state => ({
	// Focus the editor.
	focus() {
		state.isFocused = true
	},
	// Unfocus th editor; blur.
	blur() {
		state.isFocused = false
	},
	setState(data, pos1 = state.pos1, pos2 = state.pos2) {
		// ...
	},
	insert() {
		// ...
	},
	delete() {
		// ...
	},
	render() {
		// ...
	},
})

// FIXME: Can we reuse `render`?
function init(state) {
	return { ...state, Components: parse(state.data) }
}

function useEditor(initialValue = "") {
	return useMethods(reducer, { ...initialState, data: initialValue }, init)
}

export default useEditor
