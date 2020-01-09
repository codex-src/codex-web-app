import parse from "./Components"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { newVDOMCursor } from "./traverseDOM"

// User-facing editing operations:
const Operation = {
	focus:         "focus",
	blur:          "blur",
	select:        "select",
	input:         "input",
	tab:           "tab",
	enter:         "enter",
	backspace:     "backspace",
	backspaceLine: "backspace-line",
	backspaceWord: "backspace-word",
	delete:        "delete",
	deleteWord:    "delete-word",
	cut:           "cut",
	copy:          "copy",
	paste:         "paste",
}

const initialState = {
	op:        "",              // The current editing operation.
	hasFocus: false,           // Is the editor focused?
	body:      new VDOM(""),    // The VDOM body.
	pos1:      newVDOMCursor(), // The VDOM cursor start.
	pos2:      newVDOMCursor(), // The VDOM cursor end.

	// `shouldRenderDOMComponents` hints whether the editor’s
	// DOM components should be rendered.
	shouldRenderDOMComponents: 0,

	// `shouldRenderDOMCursor` hints whether the editor’s DOM
	// cursor should be rendered.
	shouldRenderDOMCursor: 0,

	reactDOM: document.createElement("div"), // The React rendered DOM.

	// The cached render types (enum).
	componentTypes: [],
}

const reducer = state => ({
	select(body, pos1, pos2) {
		// state.op = Operation.select
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	// `collapse` collapses the end cursor to the start
	// cursor.
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `write` writes at the current cursor positions.
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		this.renderDOMComponents(shouldRender)
	},
	// `greedyWrite` greedily writes and resets the cursors.
	greedyWrite(shouldRender, data, pos1, pos2, resetPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.renderDOMComponents(shouldRender)
	},
	// `drop` drops characters to the left and or right of the
	// current cursor positions.
	drop(delL, delR) {
		// Guard the anchor node or focus node:
		if ((!state.pos1.pos && delL) || (state.pos2.pos === state.body.data.length && delR)) {
			// No-op.
			this.renderDOMComponents(true) // Rerender to be safe.
			return
		}
		state.body = state.body.write("", state.pos1.pos - delL, state.pos2.pos + delR)
		state.pos1.pos -= delL
		this.collapse()
		this.renderDOMComponents(true)
	},
	setTypes(types) {
		state.types = [...types]
	},

	/*
	 * Operations
	 */
	opFocus() {
		state.op = Operation.focus
		state.hasFocus = true
	},
	opBlur() {
		state.op = Operation.blur
		state.hasFocus = false
	},
	opInput(data, pos1, pos2, resetPos) {
		state.op = Operation.input
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.renderDOMComponents(true)
	},
	opEnter() {
		state.op = Operation.enter
		this.write(true, "\n")
	},
	opTab() {
		state.op = Operation.tab
		this.write(true, "\t")
	},
	opBackspace() {
		state.op = Operation.backspace
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this.drop(length, 0)
	},
	opBackspaceWord() {
		state.op = Operation.backspaceWord
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		// Spaces:
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Non-word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this.drop(length || 1, 0) // Must delete one or more characters.
	},
	opBackspaceLine() {
		state.op = Operation.backspaceLine
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this.drop(length || 1, 0) // Must delete one or more characters.
	},
	opDelete() {
		state.op = Operation.delete
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this.drop(0, length)
	},
	opCut() {
		state.op = Operation.cut
		this.write(true, "")
	},
	opCopy() {
		state.op = Operation.copy
	},
	opPaste(data) {
		state.op = Operation.paste
		this.write(true, data)
	},

	renderDOMComponents(shouldRender) {
		state.shouldRenderDOMComponents += shouldRender
	},
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const { Components } = parse(body)
	const state = {
		...initialState,
		body,
		Components,
	}
	return state
}

function useEditor(initialValue = "") {
	return useMethods(reducer, initialState, init(initialValue))
}

export default useEditor
