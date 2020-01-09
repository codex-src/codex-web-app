import * as Components from "./Components"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import utf8 from "./utf8"
import vdom from "./vdom"

const initialState = {
	isFocused:     false,                // Is the editor focused?
	body:          new vdom.VDOM(""),    // The VDOM body.
	pos1:          traverseDOM.newPos(), // The VDOM cursor start.
	pos2:          traverseDOM.newPos(), // The VDOM cursor end.
	didCorrectPos: false,                // Did correct the VDOM cursor start and end?
	history:       [],                   // The history (and future) state stack.
	historyIndex:  -1,                   // The history (and future) state stack index.

	// `shouldRenderComponents` hints whether the editor’s
	// components should be rerendered.
	shouldRenderComponents: 0,

	// `shouldRenderPos` hints whether the editor’s cursor
	// should be rerendered.
	shouldRenderPos: 0,

	Components: [], // The rendered components.
}

const reducer = state => ({
	opFocus() {
		state.isFocused = true
	},
	opBlur() {
		state.isFocused = false
	},
	setState(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	opWrite(inputType, data) {
		if (!state.didCorrectPos) {
			state.history[0].pos1.pos = state.pos1.pos
			state.history[0].pos2.pos = state.pos2.pos
			state.didCorrectPos = true
		}
		this.prune()
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		// // NOTE: To opt-in to native rendering, conditionally
		// // increment `shouldRenderComponents`.
		// state.shouldRenderComponents += inputType !== "onKeyPress"

		// const utf8Data = [...data]
		// state.shouldRenderComponents += utf8Data.length === 1 ?? !utf8.isAlphanum(utf8Data[0]) // FIXME: ??
		state.shouldRenderComponents++
	},
	opTab() {
		this.opWrite("onKeyDown", "\t")
	},
	delete(lengthL, lengthR) {
		// Guard the current node:
		if ((!state.pos1.pos && lengthL) || (state.pos2.pos === state.body.data.length && lengthR)) {
			// No-op.
			return
		}
		this.prune()
		state.body = state.body.write("", state.pos1.pos - lengthL, state.pos2.pos + lengthR)
		state.pos1.pos -= lengthL
		this.collapse()
		state.shouldRenderComponents++
	},
	opBackspace() {
		if (state.pos1.pos !== state.pos2.pos) {
			this.delete(0, 0)
			return
		}
		const { length } = utf8.prevChar(state.body.data, state.pos1.pos)
		this.delete(length, 0)
	},
	opBackspaceWord() {
		if (state.pos1.pos !== state.pos2.pos) {
			this.delete(0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1.pos
		while (index) {
			const char = utf8.prevChar(state.body.data, index)
			if (!utf8.isHWhiteSpace(char)) {
				break
			}
			index -= char.length
		}
		// Iterate non-word characters:
		while (index) {
			const char = utf8.prevChar(state.body.data, index)
			if (utf8.isAlphanum(char) || utf8.isVWhiteSpace(char)) {
				break
			}
			index -= char.length
		}
		// Iterate word characters:
		while (index) {
			const char = utf8.prevChar(state.body.data, index)
			if (!utf8.isAlphanum(char)) {
				break
			}
			index -= char.length
		}
		// NOTE: Must delete at least one Unicode character.
		const length = state.pos1.pos - index
		if (!length) {
			this.opBackspace()
			return
		}
		this.delete(length, 0)
	},
	opBackspaceLine() {
		if (state.pos1.pos !== state.pos2.pos) {
			this.delete(0, 0)
			return
		}
		let index = state.pos1.pos
		while (index) {
			const char = utf8.prevChar(state.body.data, index)
			if (utf8.isVWhiteSpace(char)) {
				break
			}
			index -= char.length
		}
		// NOTE: Must delete at least one Unicode character.
		const length = state.pos1.pos - index
		if (!length) {
			this.opBackspace()
			return
		}
		this.delete(length, 0)
	},
	opDelete() {
		if (state.pos1.pos !== state.pos2.pos) {
			this.delete(0, 0)
			return
		}
		const { length } = utf8.nextChar(state.body.data, state.pos1.pos)
		this.delete(0, length)
	},
	opDeleteWord() {
		// TODO
	},
	storeUndo() {
		const undo = state.history[state.historyIndex]
		if (undo.body.data.length === state.body.data.length && undo.body.data === state.body.data) {
			// No-op.
			return
		}
		const { body, pos1, pos2 } = state
		state.history.push({ body, pos1, pos2 })
		state.historyIndex++
	},
	opUndo() {
		if (!state.historyIndex) {
			state.didCorrectPos = false
			return
		} //else if (state.historyIndex === 1) {
		// 	state.didCorrectPos = false
		// }
		state.historyIndex--
		const { body, pos1, pos2 } = state.history[state.historyIndex]
		Object.assign(state, { body, pos1, pos2 })
		state.shouldRenderComponents++
	},
	opRedo() {
		if (state.historyIndex + 1 === state.history.length) {
			// No-op.
			return
		}
		state.historyIndex++
		const { body, pos1, pos2 } = state.history[state.historyIndex]
		Object.assign(state, { body, pos1, pos2 })
		state.shouldRenderComponents++
	},
	prune() {
		state.history.splice(state.historyIndex + 1)
	},
	render() {
		state.Components = Components.parse(state.body)
		state.shouldRenderPos++
	},
})

// NOTE: `init` is a higher-order function that prevents
// `new VDOM` from creating a new VDOM per render.
const init = data => state => {
	const body = new vdom.VDOM(data)
	const { pos1, pos2 } = state
	const newState = {
		...state,
		body,
		history: [{ body, pos1, pos2 }],
		historyIndex: 0,
		Components: Components.parse(body),
	}
	return newState
}

const useEditor = (data = "") => useMethods(reducer, initialState, init(data))

export default useEditor
