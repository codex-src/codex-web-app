import * as Components from "./Components"
import useMethods from "use-methods"

const initialState = {
	isFocused:  false,                // Is the editor focused?
	data:       "",                   // What’s the editor’s data?                  // FIXME?
	pos1:       0,                    // What’s the editor’s cursor start position? // FIXME
	pos2:       0,                    // What’s the editor’s cursor end position?   // FIXME
	Components: Components.parse(""), // What’s are the editor’s components.
}

// NOTE: Return `state` because `state = { ...state }` loses
// the reference to `state`.
const reducer = state => ({
	focus() {
		state.isFocused = true
		return state
	},
	blur() {
		state.isFocused = false
		return state
	},
	setState(data, pos1 = state.pos1, pos2 = state.pos2) {
		if (pos1 < pos2) {
			state = { ...state, data, pos1, pos2 }
		} else {
			// Reverse order:
			state = { ...state, data, pos1: pos2, pos2: pos1 }
		}
		return state
	},
	collapseSelection() {
		state.pos2 = state.pos1
		return state
	},
	insert(data) {
		state.data = state.data.slice(0, state.pos1) + data + state.data.slice(state.pos2)
		state.pos1 += data.length
		this.collapseSelection()
		return state
	},
	delete() {
		// ...
	},
	render() {
		state.Components = Components.parse(state.data)
		return state
	},
})

function init(state) {
	return { ...state, Components: Components.parse(state.data) }
}

function useEditor(initialValue = "") {
	return useMethods(reducer, { ...initialState, data: initialValue }, init)
}

export default useEditor
