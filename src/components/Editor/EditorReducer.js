import * as Components from "./Components"
import useMethods from "use-methods"
import utf8 from "./utf8"

const initialState = {
	isFocused: false,
	data:      "",
	pos1:      0,
	pos2:      0,

	// `shouldRenderComponents` hints whether the editor’s
	// components should be rerendered.
	shouldRenderComponents: 0,

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
		// // NOTE: To opt-in to native rendering, conditionally
		// // increment `shouldRenderComponents`.
		// state.shouldRenderComponents += inputType !== "onKeyPress"
		state.shouldRenderComponents++
	},

	delete(lengthL, lengthR) {
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
		if (state.pos1 !== state.pos2) {
			this.delete(0, 0)
			return
		}
		const { length } = utf8.prevChar(state.data, state.pos1)
		this.delete(length, 0)
	},
	opBackspaceWord() {
		if (state.pos1 !== state.pos2) {
			this.delete(0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1
		while (index >= 0) {
			const char = utf8.prevChar(state.data, index)
			if (!utf8.isHWhiteSpace(char)) {
				break
			}
			index -= char.length
		}
		// Iterate non-word characters:
		while (index >= 0) {
			const char = utf8.prevChar(state.data, index)
			if (utf8.isAlphanum(char)) {
				break
			}
			index -= char.length
		}
		// Iterate word characters:
		while (index >= 0) {
			const char = utf8.prevChar(state.data, index)
			if (!utf8.isAlphanum(char)) {
				break
			}
			index -= char.length
		}
		const length = state.pos1 - index
		this.delete(length, 0)
	},
	opBackspaceLine() {
		// TODO
	},
	opDelete() {
		if (state.pos1 !== state.pos2) {
			this.delete(0, 0)
			return
		}
		const { length } = utf8.nextChar(state.data, state.pos1)
		this.delete(0, length)
	},
	opDeleteWord() {
		// TODO
	},

	// deleteWordOperation(dir) {
	// 	const { data, pos1, pos2 } = getVars(state)
	// 	if (pos1 !== pos2 || (((dir === -1 && pos1 - 1 >= 0) || (!dir && pos1 < data.length)) && data[pos1 + dir] === "\n")) {
	// 		this.deleteOperation(dir || 1)
	// 		return
	// 	}
	// 	// Iterate spaces.
	// 	let index = pos1 // Use `let`.
	// 	while ((dir === -1 && index - 1 >= 0) || (!dir && index < data.length)) {
	// 		if (data[index + dir] !== " ") {
	// 			break
	// 		}
	// 		index += dir || 1
	// 	}
	// 	// Iterate non-word characters.
	// 	while ((dir === -1 && index - 1 >= 0) || (!dir && index < data.length)) {
	// 		if (Unicode.isAlphanum(data[index + dir]) || data[index + dir] === "\n") {
	// 			break
	// 		}
	// 		index += dir || 1
	// 	}
	// 	// Iterate word characters.
	// 	while ((dir === -1 && index - 1 >= 0) || (!dir && index < data.length)) {
	// 		if (!Unicode.isAlphanum(data[index + dir])) {
	// 			break
	// 		}
	// 		index += dir || 1
	// 	}
	// 	dir = index - pos1
	// 	this.deleteOperation(dir)
	// },
	// deleteLineOperation(dir) {
	// 	const { data, pos1, pos2 } = getVars(state)
	// 	if (pos1 !== pos2 || (((dir === -1 && pos1 - 1 >= 0) || (!dir && pos1 < data.length)) && data[pos1 + dir] === "\n")) {
	// 		this.deleteOperation(dir || 1)
	// 		return
	// 	}
	// 	let index = pos1 // Use `let`.
	// 	while ((dir === -1 && index - 1 >= 0) || (!dir && index < data.length)) {
	// 		if (data[index + dir] === "\n") {
	// 			break
	// 		}
	// 		index += dir || 1
	// 	}
	// 	dir = index - pos1
	// 	this.deleteOperation(dir)
	// },
	// commitBackspace()     { this.deleteOperation    (-1) },
	// commitBackspaceWord() { this.deleteWordOperation(-1) },
	// commitBackspaceLine() { this.deleteLineOperation(-1) },
	// commitDelete()        { this.deleteOperation    ( 1) }, // NOTE: Use `1`.
	// commitDeleteWord()    { this.deleteWordOperation( 0) },

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
