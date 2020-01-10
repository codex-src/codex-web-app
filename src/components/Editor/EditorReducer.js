import markdown from "lib/encoding/markdown"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { newVDOMCursor } from "./traverseDOM"

import {
	parseComponents,
	sameTypes,
} from "./Components"

// User editing operations:
const Operation = {
	focus:         "focus",
	blur:          "blur",
	// select:     "select",
	input:         "input",
	tab:           "tab",
	enter:         "enter",
	backspace:     "backspace",
	backspaceWord: "backspace-word",
	backspaceLine: "backspace-line",
	delete:        "delete",
	deleteWord:    "delete-word",
	cut:           "cut",
	copy:          "copy",
	paste:         "paste",
}

const initialState = {
	op:         "",              // The current editing operation.
	hasFocus:   false,           // Does the editor have focus?
	body:       new VDOM(""),    // The VDOM body.
	pos1:       newVDOMCursor(), // The VDOM cursor start.
	pos2:       newVDOMCursor(), // The VDOM cursor end.
	Components: [],              // The parsed components.
	types:      [],              // The parsed component types.

	// `shouldRender` hints whether to rerender; uses a
	// counter to track the number of renders.
	shouldRender: 0,

	// `shouldRenderDOMCursor` hints whether to rerender the
	// user facing DOM cursor; uses a counter to track the
	// number of renders.
	shouldRenderDOMCursor: 0,

	// The React rendered DOM.
	reactDOM: document.createElement("div"),
}

const reducer = state => ({
	// TODO: Add comment.
	setState(body, pos1, pos2) {
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
	write(data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		this.render()
	},
	// `greedyWrite` greedily writes and resets the cursors.
	greedyWrite(data, pos1, pos2, resetPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.render()
	},
	// `drop` drops characters from the left and or right of
	// the current cursor positions.
	drop(dropL, dropR) {
		// Guard the anchor node and or focus node:
		if ((!state.pos1.pos && dropL) || (state.pos2.pos === state.body.data.length && dropR)) {
			// No-op.
			return
		}
		state.body = state.body.write("", state.pos1.pos - dropL, state.pos2.pos + dropR)
		state.pos1.pos -= dropL
		this.collapse()
		this.render()
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
		this.greedyWrite(data, pos1, pos2, resetPos)
	},
	opEnter() {
		state.op = Operation.enter
		this.write("\n")
	},
	opTab() {
		state.op = Operation.tab
		this.write("\t")
	},
	// FIXME: Use `text` instead of `utf8`?
	opBackspace() {
		state.op = Operation.backspace
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this.drop(length, 0)
	},
	// FIXME: Use `text` instead of `utf8`?
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
	// FIXME: Use `text` instead of `utf8`?
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
	// FIXME: Use `text` instead of `utf8`?
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
		this.write("")
	},
	opCopy() {
		state.op = Operation.copy
	},
	opPaste(data) {
		state.op = Operation.paste
		this.write(data)
	},

	// `render` updates `shouldRender`.
	render() {
		// Get the current types and parse new types:
		const { types } = state
		const { Components, types: newTypes } = parseComponents(state.body)
		Object.assign(state, {
			Components,      // The new components.
			types: newTypes, // The new component types.
		})
		// Guard edge case at markdown start:
		//
		//  #·H<cursor> -> ["#", " "]
		// //·H<cursor> -> ["/", " "]
		//  >·H<cursor> -> [">", " "]
		//
		const markdownStart = (
			state.pos1.pos - 3 >= 0 &&
			markdown.isSyntax(state.body.data[state.pos1.pos - 3]) &&
			state.body.data[state.pos1.pos - 2] === " "
		)
		// Native rendering strategy:
		state.shouldRender += state.op !== Operation.input || !sameTypes(types, newTypes) || markdownStart
	},
	// `renderDOMCursor` updates `shouldRenderDOMCursor`.
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const { Components, types } = parseComponents(body)
	const state = {
		...initialState,
		body,
		Components,
		types,
	}
	return state
}

function useEditor(initialValue = "") {
	return useMethods(reducer, initialState, init(initialValue))
}

export default useEditor
