import OperationTypes from "./OperationTypes"
import utf8 from "lib/encoding/utf8"

const operations = state => ({
	commit(op) {
		if (op === OperationTypes.SELECT && Date.now() - state.opTimestamp < 100) {
			// No-op.
			return
		}
		const opTimestamp = Date.now()
		Object.assign(state, { op, opTimestamp })
	},

	commitSelect(pos1, pos2) {
		this.commit(OperationTypes.SELECT)
		this.setState(state.body, pos1, pos2)
	},
	commitFocus() {
		this.commit(OperationTypes.FOCUS)
		state.hasFocus = true
	},
	commitBlur() {
		this.commit(OperationTypes.BLUR)
		state.hasFocus = false
	},
	commitInput(data, pos1, pos2, resetPos) {
		this.commit(OperationTypes.INPUT)
		this.greedyWrite(data, pos1, pos2, resetPos)
	},
	commitEnter() {
		this.commit(OperationTypes.ENTER)
		this.write("\n")
	},
	commitTab() {
		this.commit(OperationTypes.TAB)
		this.write("\t")
	},
	commitBackspace() {
		this.commit(OperationTypes.BACKSPACE)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this.dropBytes(length, 0)
	},
	commitBackspaceWord() {
		this.commit(OperationTypes.BACKSPACEWORD)
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
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
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
		this.dropBytes(length || 1, 0)
	},
	commitBackspaceLine() {
		this.commit(OperationTypes.BACKSPACELINE)
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
		this.dropBytes(length || 1, 0)
	},
	commitDelete() {
		this.commit(OperationTypes.DELETE)
		if (state.pos1.pos !== state.pos2.pos) {
			this.dropBytes(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this.dropBytes(0, length)
	},
	commitCut() {
		this.commit(OperationTypes.CUT)
		this.write("")
	},
	commitCopy() {
		this.commit(OperationTypes.COPY)
		// (Idempotent)
	},
	commitPaste(data) {
		this.commit(OperationTypes.PASTE)
		this.write(data)
	},
	commitUndo() {
		this.commit(OperationTypes.UNDO)
		if (!state.historyIndex) {
			// No-op.
			return
		} else if (state.historyIndex === 1 && state.didWritePos) {
			state.didWritePos = false
		}
		state.historyIndex--
		const undoState = state.history[state.historyIndex]
		Object.assign(state, undoState)
		this.render()
	},
	commitRedo() {
		this.commit(OperationTypes.REDO)
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

export default operations
