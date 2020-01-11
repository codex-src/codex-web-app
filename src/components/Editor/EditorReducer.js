import markdown from "lib/encoding/markdown"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { VDOMCursor } from "./traverseDOM"

import {
	parseComponents,
	sameComponents,
} from "./Components"

// Editing operations:
const Operation = {
	init:          "initialize",
	select:        "select",
	focus:         "focus",
	blur:          "blur",
	input:         "input",
	tab:           "tab",
	enter:         "enter",
	backspace:     "backspace",
	backspaceWord: "backspace word",
	backspaceLine: "backspace line",
	delete:        "delete",
	deleteWord:    "delete word",
	cut:           "cut",
	copy:          "copy",
	paste:         "paste",
	undo:          "undo",
	redo:          "redo",
}

const initialState = {
	op:            Operation.init,
	opRecordedAt:  0,
	hasFocus:      false,
	body:          new VDOM(""),
	pos1:          new VDOMCursor(),
	pos2:          new VDOMCursor(),
	Components:    [],
	didWritePos:   false,
	history:       [],
	historyIndex:  -1,

	// `shouldRender` hints whether to rerender; uses a
	// counter to track the number of renders.
	shouldRender: 0,

	// `shouldRenderDOMCursor` hints whether to rerender the
	// user facing DOM cursor; uses a counter to track the
	// number of renders.
	shouldRenderDOMCursor: 0,

	reactDOM: document.createElement("div"),
}

const reducer = state => ({
	// `setState` sets the VDOM state.
	setState(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			;[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	// `recordOp` records the current editing operation.
	recordOp(op) {
		if (op === Operation.select && Date.now() - state.opRecordedAt < 100) {
			// No-op.
			return
		}
		const opRecordedAt = Date.now()
		Object.assign(state, { op, opRecordedAt })
	},
	// `collapse` collapses the VDOM cursors to the start
	// cursor.
	collapse() {
		state.pos2 = state.pos1
	},
	// `write` writes at the current cursor positions.
	write(data) {
		if (!state.didWritePos) {
			state.history[0].pos1.pos = state.pos1.pos
			state.history[0].pos2.pos = state.pos2.pos
			state.didWritePos = true
		}
		this.pruneRedos()
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		this.render()
	},
	// `greedyWrite` greedily writes to the cursor positions
	// then resets the VDOM cursors.
	greedyWrite(data, pos1, pos2, resetPos) {
		if (!state.didWritePos) {
			state.history[0].pos1.pos = state.pos1.pos
			state.history[0].pos2.pos = state.pos2.pos
			state.didWritePos = true
		}
		this.pruneRedos()
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this.collapse()
		this.render()
	},
	// `drop` drops characters from the left and or right of
	// the current cursor positions.
	drop(dropL, dropR) {
		// Guard the start node and or end node:
		if ((!state.pos1.pos && dropL) || (state.pos2.pos === state.body.data.length && dropR)) {
			// No-op.
			return
		}
		this.pruneRedos()
		state.body = state.body.write("", state.pos1.pos - dropL, state.pos2.pos + dropR)
		state.pos1.pos -= dropL
		this.collapse()
		this.render()
	},
	// `storeUndo` stores the current state to the history
	// state stack.
	storeUndo() {
		const undoState = state.history[state.historyIndex]
		if (undoState.body.data.length === state.body.data.length && undoState.body.data === state.body.data) {
			// No-op.
			return
		}
		const { body, pos1, pos2 } = state
		state.history.push({ body, pos1: pos1.copy(), pos2: pos2.copy() })
		state.historyIndex++
	},
	// `pruneRedos` prunes future states from the history
	// state stack.
	pruneRedos() {
		state.history.splice(state.historyIndex + 1)
	},

	/*
	 * Operations
	 */
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
	opInput(data, pos1, pos2, resetPos) {
		this.recordOp(Operation.input)
		this.greedyWrite(data, pos1, pos2, resetPos)
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
		// No-op.
	},
	opPaste(data) {
		this.recordOp(Operation.paste)
		this.write(data)
	},
	opUndo() {
		this.recordOp(Operation.undo)
		if (state.historyIndex <= 1) {
			state.didWritePos = false
		}
		if (!state.historyIndex) {
			// No-op.
			return
		}
		state.historyIndex--
		const undoState = state.history[state.historyIndex]
		Object.assign(state, undoState)
		this.render()
	},
	opRedo() {
		this.recordOp(Operation.redo)
		if (state.historyIndex + 1 === state.history.length) {
			// No-op.
			return
		}
		state.historyIndex++
		const redoState = state.history[state.historyIndex]
		Object.assign(state, redoState)
		this.render()
	},
	// `render` conditionally updates `shouldRender`.
	render() {
		// Get the current components and parse new components:
		const Components = state.Components.map(each => ({ ...each })) // Read proxy.
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
	let { body, pos1, pos2 } = initialState
	body = body.write(initialValue, 0, body.data.length)
	const Components = parseComponents(body)
	const state = {
		...initialState,
		body,
		Components,
		history: [{ body, pos1: pos1.copy(), pos2: pos2.copy() }],
		historyIndex: 0,
	}
	return state
}

function useEditor(initialValue = "") {
	return useMethods(reducer, initialState, init(initialValue))
}

export default useEditor
