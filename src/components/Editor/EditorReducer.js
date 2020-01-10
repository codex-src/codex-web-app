import markdown from "lib/encoding/markdown"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { newVDOMCursor } from "./traverseDOM"

import {
	parseComponents,
	sameComponents,
} from "./Components"

// User editing operations:
const Operation = {
	select:        "select",
	focus:         "focus",
	blur:          "blur",
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
	op:           "",              // The current editing operation.
	opRecordedAt: 0,               // When was the current editing operation recorded?
	hasFocus:     false,           // Does the editor have focus?
	body:         new VDOM(""),    // The VDOM body.
	pos1:         newVDOMCursor(), // The VDOM cursor start.
	pos2:         newVDOMCursor(), // The VDOM cursor end.
	Components:   [],              // The parsed components.
	types:        [],              // The parsed component types.

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
	// `setState` sets the VDOM state.
	setState(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, {
			body,
			pos1,
			pos2,
		})
	},
	// `recordOp` records the current editing operation.
	recordOp(op) {
		if (op === Operation.select && Date.now() - state.opRecordedAt < 20) {
			// No-op.
			return
		}
		Object.assign(state, {
			op,
			opRecordedAt: Date.now(),
		})
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

	opSelect(pos1, pos2) {
		this.recordOp(Operation.select)
		this.setState(state.body, pos1, pos2)
	},
	opFocus() {
		this.recordOp(Operation.focus)
		state.hasFocus = true
	},
	opBlur() {
		this.recordOp(Operation.blur)
		state.hasFocus = false
	},
	// const { exact, offsetStart, offsetEnd } = diffString(state.body.data.slice(pos1, pos2), data)
	opInput(data, pos1, pos2, resetPos) {
		this.recordOp(Operation.input)
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.render()
	},
	opEnter() {
		this.recordOp(Operation.enter)
		this.write("\n")
	},
	opTab() {
		this.recordOp(Operation.tab)
		this.write("\t")
	},
	opBackspace() {
		this.recordOp(Operation.backspace)
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this.drop(length, 0)
	},
	opBackspaceWord() {
		this.recordOp(Operation.backspaceWord)
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate non-word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate word characters:
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
		this.recordOp(Operation.backspaceLine)
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
		this.recordOp(Operation.delete)
		if (state.pos1.pos !== state.pos2.pos) {
			this.drop(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this.drop(0, length)
	},
	opCut() {
		this.recordOp(Operation.cut)
		this.write("")
	},
	opCopy() {
		this.recordOp(Operation.copy)
	},
	opPaste(data) {
		this.recordOp(Operation.paste)
		this.write(data)
	},

	// `render` updates `shouldRender`.
	render() {
		// Get the current components and parse new components:
		const Components = state.Components.slice().map(each => ({ ...each })) // Read proxy.
		const NewComponents = parseComponents(state.body)
		state.Components = NewComponents
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
		state.shouldRender += state.op !== Operation.input || !sameComponents(Components, NewComponents) || markdownStart
	},
	// `renderDOMCursor` updates `shouldRenderDOMCursor`.
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const Components = parseComponents(body)
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
