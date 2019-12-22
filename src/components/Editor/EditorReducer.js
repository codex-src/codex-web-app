import * as Components from "./Components"
import useMethods from "use-methods"

// // `shouldRender` provides a hint to `render` as to
// // whether a rerender is needed. This mocks Draft.js’s
// // native rendering feature.
// //
// // https://draftjs.org/docs/api-reference-editor-state/#nativelyrenderedcontent
// shouldRender: true,

const initialState = {
	isFocused: false,
	data:      "",
	pos1:      0,
	pos2:      0,

	// NOTE: `shouldRenderComponents` and `shouldRenderPos`
	// use a counter (instead of a flag) because the value is
	// unimportant, and a counter can count VDOM rerenders.
	//
	// `shouldRenderComponents` hints whether the editor’s
	// components should be rerendered. This mocks Draft.js’s
	// native rendering feature.
	//
	// https://draftjs.org/docs/api-reference-editor-state/#nativelyrenderedcontent
	shouldRenderComponents: 0,
	//
	// `shouldRenderPos` hints whether the editor’s cursor
	// positions should be rerendered.
	shouldRenderPos: 0,

	Components: [],
}

// NOTE: Use `Object.assign` to assign multiple properties
// because `state` is a reference type.
const reducer = state => ({
	opFocus() {
		state.isFocused = true
	},
	opBlur() {
		state.isFocused = false
	},
	// NOTE: Based on experience, `opSelect` needs to set
	// `data` and `pos1` and `pos2`.
	opSelect(data, pos1 = state.pos1, pos2 = state.pos2) {
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
		state.data = state.data.slice(0, state.pos1) + data + state.data.slice(state.pos2)
		state.pos1 += data.length
		this.collapse()
		// NOTE: To opt-in to native rendering, conditionally
		// increment `shouldRenderComponents`.
		state.shouldRenderComponents += inputType !== "onKeyPress"
	},
	delete(lengthL, lengthR) {
		if (state.pos1 !== state.pos2) {
			lengthL = 0
			lengthR = 0
		}
		// Guard the current node:
		if ((!state.pos1 && lengthL) || (state.pos2 === state.data.length && lengthR)) {
			// No-op.
			return
		}
		state.data = state.data.slice(0, state.pos1 - lengthL) + state.data.slice(state.pos2 + lengthR)
		state.pos1 -= lengthL
		this.collapse()
		state.shouldRenderComponents++
	},
	opBackspace() {
		this.delete(1, 0)
	},
	opBackspaceWord() {
		// ...
	},
	opBackspaceLine() {
		// ...
	},
	// opDelete() {
	// 	// ...
	// },
	// opDeleteWord() {
	// 	// ...
	// },
	render() {
		state.Components = Components.parse(state.data)
		state.shouldRenderPos++
	},
})

function init(state) {
	return { ...state, Components: Components.parse(state.data) }
}

function useEditor(data = "") {
	return useMethods(reducer, { ...initialState, data }, init)
}

export default useEditor
