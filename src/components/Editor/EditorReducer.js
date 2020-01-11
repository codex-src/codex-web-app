import OperationTypes from "./OperationTypes"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { parseComponents } from "./Components"
import { VDOMCursor } from "./traverseDOM"

import {
	historyReducerFragment,
	renderReducerFragment,
	setStateReducerFragment,
} from "./ReducerFragments"

const initialState = {
	op:           OperationTypes.INIT,
	opRecordedAt: 0,
	hasFocus:     false,
	body:         new VDOM(""),
	pos1:         new VDOMCursor(),
	pos2:         new VDOMCursor(),
	Components:   [],
	didWritePos:  false,
	history:      [],
	historyIndex: -1,

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

	 ...historyReducerFragment(state), // eslint-disable-line
	  ...renderReducerFragment(state), // eslint-disable-line
	...setStateReducerFragment(state), // eslint-disable-line

	commitSelect(pos1, pos2) {
		this.recordOp(OperationTypes.SELECT)
		this.setState(state.body, pos1, pos2)
	},
	commitFocus() {
		this.recordOp(OperationTypes.FOCUS)
		state.hasFocus = true
	},
	commitBlur() {
		this.recordOp(OperationTypes.BLUR)
		state.hasFocus = false
	},
	commitInput(data, pos1, pos2, resetPos) {
		this.recordOp(OperationTypes.INPUT)
		this.greedyWrite(data, pos1, pos2, resetPos)
	},
	commitEnter() {
		this.recordOp(OperationTypes.ENTER)
		this.write("\n")
	},
	commitTab() {
		this.recordOp(OperationTypes.TAB)
		this.write("\t")
	},
	// REFACTOR
	commitBackspace() {
		this.recordOp(OperationTypes.BACKSPACE)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this.dropBytes(length, 0)
	},
	// REFACTOR
	commitBackspaceWord() {
		this.recordOp(OperationTypes.BACKSPACEWORD)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
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
		this.dropBytes(length || 1, 0) // Must delete one or more characters.
	},
	// REFACTOR
	commitBackspaceLine() {
		this.recordOp(OperationTypes.BACKSPACELINE)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
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
		this.dropBytes(length || 1, 0) // Must delete one or more characters.
	},
	// REFACTOR
	commitDelete() {
		this.recordOp(OperationTypes.DELETE)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this.dropBytes(0, length)
	},
	commitCut() {
		this.recordOp(OperationTypes.CUT)
		this.write("")
	},
	commitCopy() {
		this.recordOp(OperationTypes.COPY)
		// No-op.
	},
	commitPaste(data) {
		this.recordOp(OperationTypes.PASTE)
		this.write(data)
	},
	commitUndo() {
		this.recordOp(OperationTypes.undo)
		if (!state.historyIndex) {
			// No-op.
			return
		}
		state.historyIndex--
		const undoState = state.history[state.historyIndex]
		Object.assign(state, undoState)
		this.render()
	},
	commitRedo() {
		this.recordOp(OperationTypes.redo)
		if (state.historyIndex + 1 === state.history.length) {
			// No-op.
			return
		}
		state.historyIndex++
		const redoState = state.history[state.historyIndex]
		Object.assign(state, redoState)
		this.render()
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
