import * as Components from "./Components"
// import opTypes from "./opTypes"
import useMethods from "use-methods"

const initialState = {
	isFocused:    false,
	data:         "",
	pos1:         0,
	pos2:         0,
	shouldRender: true,
	Components:   [],
}

// NOTE: Use `Object.assign` to assign multiple properties
// because `state` is a reference type.
const reducer = state => ({
	opFocus() {
		// state.lastOpType = opTypes.focus
		state.isFocused = true
	},
	opBlur() {
		// state.lastOpType = opTypes.blur
		state.isFocused = false
	},
	// NOTE: Based on experience, `opSelect` needs to set
	// `data` and `pos1` and `pos2`.
	opSelect(data, pos1 = state.pos1, pos2 = state.pos2) {
		// state.lastOpType = opTypes.select
		if (pos1 < pos2) {
			Object.assign(state, { data, pos1, pos2 })
		} else {
			// Reverse order; `pos1` can never be greater than
			// `pos2`.
			Object.assign(state, { data, pos1: pos2, pos2: pos1 })
		}
	},
	collapse() {
		state.pos2 = state.pos1
	},
	opWrite(inputType, data) {
		state.shouldRender = inputType !== "onKeyPress"
		state.data = state.data.slice(0, state.pos1) + data + state.data.slice(state.pos2)
		state.pos1 += data.length
		this.collapse()
	},
	opDelete() {
		// ...
	},
	render() {
		if (!state.shouldRender) {
			// Reset shouldRender:
			state.shouldRender = true
			return
		}
		state.Components = Components.parse(state.data)
	},
})

function init(state) {
	return { ...state, Components: Components.parse(state.data) }
}

function useEditor(data = "") {
	return useMethods(reducer, { ...initialState, data }, init)
}

export default useEditor
