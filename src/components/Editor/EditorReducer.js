import emoji from "emoji-trie"
import Enum from "utils/Enum"
import parseComponents from "./Components"
import useMethods from "use-methods"
import utf8 from "utils/encoding/utf8"

const ActionTypes = new Enum(
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

const initialState = {
	// Preferences:
	prefersCodeStylesheet: false,
	prefersReadOnlyMode: false,
	prefersTextBackground: true,
	prefersClassName: "prefers-text-stylesheet prefers-text-background",

	// Reducer:
	epoch: 0,            // The epoch (time stamp) of the editor
	actionType: "",      // The type of the current action
	actionTimeStamp: 0,  // The time stamp (since epoch) of the current action
	isFocused: false,    // Is the editor focused?
	hasSelection: false, // Does the editor have a selection?
	data: "",            // The plain text data
	pos1: null,          // The start cursor
	pos2: null,          // The end cursor
	// coords: null,     // The cursor coords
	components: null,    // The React components
	shouldRender: 0,     // Should render the DOM and cursor?
	reactDOM: null,      // The React DOM (not what the user sees)
	history: [],         // The history state stack
	historyIndex: 0,     // The history state stack index
	didSetPos: false,    // Did set the cursors before the first write?
}

const reducer = state => ({
	updatedPrefs() {
		const classNames = []
		// Prefers code stylesheet:
		if (!state.prefersReadOnlyMode && state.prefersCodeStylesheet) {
			classNames.push("prefers-code-stylesheet")
		} else {
			classNames.push("prefers-text-stylesheet")
		}
		// Prefers text background:
		if (!state.prefersReadOnlyMode && state.prefersTextBackground) {
			classNames.push("prefers-text-background")
		}
		// Prefers read-only mode:
		if (state.prefersReadOnlyMode) {
			classNames.push("prefers-read-only-mode")
		}
		state.prefersClassName = classNames.join(" ")
	},
	preferTextStylesheet() {
		state.prefersReadOnlyMode = false // Reset
		state.prefersCodeStylesheet = false
		this.updatedPrefs()
	},
	preferCodeStylesheet() {
		state.prefersReadOnlyMode = false // Reset
		state.prefersCodeStylesheet = true
		this.updatedPrefs()
	},
	preferTextBackground() {
		state.prefersReadOnlyMode = false // Reset
		state.prefersTextBackground = !state.prefersTextBackground
		this.updatedPrefs()
	},
	toggleReadOnlyMode() {
		state.prefersReadOnlyMode = !state.prefersReadOnlyMode
		this.updatedPrefs()
	},
	newAction(actionType) {
		const actionTimeStamp = Date.now()
		if (actionType === ActionTypes.SELECT && actionTimeStamp - state.actionTimeStamp < 200) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimeStamp })
	},
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.isFocused = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.isFocused = false
	},
	actionSelect(pos1, pos2 /* , coords */) {
		this.newAction(ActionTypes.SELECT)
		const hasSelection = pos1.pos !== pos2.pos
		Object.assign(state, { hasSelection, pos1, pos2, /* coords, */ })
	},
	actionInput(data, pos1, pos2) {
		this.newAction(ActionTypes.INPUT)
		if (!state.historyIndex && !state.didSetPos) {
			const [undo] = state.history
			undo.pos1.pos = state.pos1.pos
			undo.pos2.pos = state.pos2.pos
			state.didSetPos = true
		}
		this.dropRedos()
		Object.assign(state, { data, pos1, pos2 })
		this.render()
	},
	write(substr, dropL = 0, dropR = 0) {
		if (!state.historyIndex && !state.didSetPos) {
			const [undo] = state.history
			undo.pos1.pos = state.pos1.pos
			undo.pos2.pos = state.pos2.pos
			state.didSetPos = true
		}
		this.dropRedos()
		state.data = state.data.slice(0, state.pos1.pos - dropL) + substr + state.data.slice(state.pos2.pos + dropR)
		state.pos1.pos = state.pos1.pos - dropL + substr.length
		state.pos2.pos = state.pos1.pos
		this.render()
	},
	backspaceChar() {
		let dropL = 0
		if (!state.hasSelection && state.pos1.pos) { // Inverse
			const substr = state.data.slice(0, state.pos1.pos)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			dropL = rune.length
		}
		this.write("", dropL, 0)
	},
	backspaceWord() {
		if (state.hasSelection) {
			this.write("")
			return
		}
		// Iterate to an alphanumeric rune:
		let index = state.pos1.pos
		while (index >= 0) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!rune || utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate to a non-alphanumeric rune:
		while (index >= 0) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!rune || !utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1.pos - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceLine() {
		if (state.hasSelection) {
			this.write("")
			return
		}
		// Iterate to a v. white space rune:
		let index = state.pos1.pos
		while (index >= 0) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!rune || utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1.pos - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceCharForwards() {
		let dropR = 0
		if (!state.hasSelection && state.pos1.pos < state.data.length) { // Inverse
			const substr = state.data.slice(state.pos1.pos)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			dropR = rune.length
		}
		this.write("", 0, dropR)
	},
	backspaceWordForwards() {
		if (state.hasSelection) {
			this.write("")
			return
		}
		// Iterate to an alphanumeric rune:
		let index = state.pos1.pos
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
		let dropR = index - state.pos1.pos
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
		this.newAction(ActionTypes.CUT)
		this.write("")
	},
	copy() {
		this.newAction(ActionTypes.COPY)
		// Idempotent
	},
	paste(substr) {
		this.newAction(ActionTypes.PASTE)
		this.write(substr)
	},
	storeUndo() {
		// TODO: Compare cursors?
		const undo = state.history[state.historyIndex]
		if (undo.data === state.data) {
			// No-op
			return
		}
		const { data, pos1, pos2 } = state
		state.history.push({ data, pos1: { ...pos1 }, pos2: { ...pos2 } })
		state.historyIndex++
	},
	dropRedos() {
		state.history.splice(state.historyIndex + 1)
	},
	undo() {
		this.newAction(ActionTypes.UNDO)
		if (!state.historyIndex) {
			// No-op
			return
		} else if (state.historyIndex === 1 && state.didSetPos) {
			state.didSetPos = false
		}
		state.historyIndex--
		const undo = state.history[state.historyIndex]
		Object.assign(state, undo)
		this.render()
	},
	redo() {
		this.newAction(ActionTypes.REDO)
		if (state.historyIndex + 1 === state.history.length) {
			// No-op
			return
		}
		state.historyIndex++
		const redo = state.history[state.historyIndex]
		Object.assign(state, redo)
		this.render()
	},
	render() {
		state.components = parseComponents(state.data)
		state.shouldRender++
	},
})

// Creates a new cursor.
function newPos() {
	const pos = {
		x: 0,
		y: 0,
		pos: 0,
	}
	return pos
}

const init = initialValue => initialState => {
	const state = {
		...initialState,
		data: initialValue,
		pos1: newPos(),
		pos2: newPos(),
		// coords: {
		// 	pos1: {
		// 		x: 0,
		// 		y: 0,
		// 	},
		// 	pos2: {
		// 		x: 0,
		// 		y: 0,
		// 	},
		// },
		components: parseComponents(initialValue),
		reactDOM: document.createElement("div"),
		history: [{ data: initialValue, pos1: newPos(), pos2: newPos() },
		],
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
