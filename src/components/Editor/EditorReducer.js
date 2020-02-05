import emoji from "emoji-trie"
import Enum from "utils/Enum"
import parseComponents from "./Components"
import useMethods from "use-methods"
import utf8 from "utils/encoding/utf8"

const ActionTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"INPUT",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

// didWritePos: false,
const initialState = {
	epoch:           0,     // The epoch (time stamp) of the editor
	actionType:      "",    // The type of the current action
	actionTimeStamp: 0,     // The time stamp (since epoch) of the current action
	focused:         false, // Is the editor focused?
	data:            "",    // The plain text data
	pos1:            0,     // The start cursor
	pos2:            0,     // The end cursor
	coords:          null,  // The cursor coords
	// atStart:      false, // Are the cursors exclusively at the start?
	// atEnd:        false, // Are the cursors exclusively at the end?
	collapsed:       false, // Are the cursors collapsed?
	history:         [],    // The history state stack
	historyIndex:    0,     // The history state stack index
	components:      null,  // The React components
	shouldRender:    0,     // Should render the DOM and cursor?
	reactDOM:        null,  // The React DOM (not what the user sees)
}

const reducer = state => ({
	newAction(actionType) {
		const actionTimeStamp = Date.now() - state.epoch
		if (actionType === ActionTypes.SELECT && actionTimeStamp - state.actionTimeStamp < 200) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimeStamp })
	},
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.focused = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.focused = false
	},
	actionSelect(pos1, pos2, coords) {
		this.newAction(ActionTypes.SELECT)
		const collapsed = pos1 === pos2
		Object.assign(state, { pos1, pos2, coords, collapsed })
	},
	actionInput(data, pos1, pos2, coords = state.coords) {
		this.newAction(ActionTypes.INPUT)
		Object.assign(state, { data, pos1, pos2, coords })
		this.render()
	},
	write(substr, dropL = 0, dropR = 0) { // dropL and dropR are expected to be >= 0
		const data = state.data.slice(0, state.pos1 - dropL) + substr + state.data.slice(state.pos2 + dropR)
		const pos1 = state.pos1 - dropL + substr.length
		const pos2 = pos1
		this.actionInput(data, pos1, pos2, state.coords) // Synthetic coords
	},
	backspaceRune() {
		let dropL = 0
		if (state.collapsed && state.pos1) { // Inverse
			const substr = state.data.slice(0, state.pos1)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			dropL = rune.length
		}
		this.write("", dropL, 0)
	},
	backspaceWord() {
		if (!state.collapsed) {
			this.write("")
			return
		}
		// Iterate to an alphanumeric rune:
		//
		// NOTE: Use index not index >= 0
		let index = state.pos1
		while (index) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate to a non-alphanumeric rune:
		while (index) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceLine() {
		if (!state.collapsed) {
			this.write("")
			return
		}
		// Iterate to a v. white space rune:
		let index = state.pos1
		while (index) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceRuneForwards() {
		let dropR = 0
		if (state.collapsed && state.pos1 < state.data.length) { // Inverse
			const substr = state.data.slice(state.pos1)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			dropR = rune.length
		}
		this.write("", 0, dropR)
	},
	backspaceWordForwards() {
		if (!state.collapsed) { // || state.pos1 === state.data.length) {
			this.write("")
			return
		}
		// Iterate to an alphanumeric rune:
		let index = state.pos1
		while (index < state.data.length) {
			const substr = state.data.slice(index)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Iterate to a non-alphanumeric rune:
		while (index < state.data.length) {
			const substr = state.data.slice(index)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Get the number of bytes to drop:
		let dropR = index - state.pos1
		if (!dropR && index < state.data.length && state.data[index] === "\n") {
			dropR = 1
		}
		this.write("", 0, dropR)
	},
	tab() {
		this.write("\t")
	},
	enter() {
		this.write("\n")
	},
	cut() {
		this.write("")
		this.newAction(ActionTypes.CUT)
	},
	copy() {
		// Idempotent
		this.newAction(ActionTypes.COPY)
	},
	paste(substr) {
		if (!substr) {
			// No-op
			return
		}
		this.write(substr)
		this.newAction(ActionTypes.PASTE)
	},
	undo() {
		// this.newAction(ActionTypes.UNDO)
		// if (!state.historyIndex) {
		// 	// No-op.
		// 	return
		// } // } else if (state.historyIndex === 1 && state.didWritePos) {
		// // 	state.didWritePos = false
		// // }
		// state.historyIndex--
		// const undoState = state.history[state.historyIndex]
		// Object.assign(state, undoState)
		// this.render()
	},
	redo() {
		// this.newAction(ActionTypes.REDO)
		// if (state.historyIndex + 1 === state.history.length) {
		// 	// No-op.
		// 	return
		// }
		// state.historyIndex++
		// const redoState = state.history[state.historyIndex]
		// Object.assign(state, redoState)
		// this.render()
	},
	render() {
		state.components = parseComponents(state.data)
		state.shouldRender++
	},
})

const init = initialValue => initialState => {
	const epoch = Date.now()
	const state = {
		...initialState,
		epoch,
		actionType: ActionTypes.INIT,
		// actionTimeStamp: Date.now() - epoch,
		data: initialValue,
		coords: {
			pos1: {
				x: 0,
				y: 0,
			},
			pos2: {
				x: 0,
				y: 0,
			},
		},
		components: parseComponents(initialValue),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
