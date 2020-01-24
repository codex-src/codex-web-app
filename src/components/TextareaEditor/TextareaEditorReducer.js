import ActionTypes from "./ActionTypes"
import useMethods from "use-methods"
import { parseComponents } from "./Components"

const initialState = {
	actionType: "",             // The editing operation type
	actionTimestamp: 0,         // The editing operation timestamp
	value: "",                  // The plain text data
	isFocused: false,           // Is the editor focused?
	selectionStart: 0,          // The start cursor
	selectionEnd: 0,            // The end cursor
	components: null,           // The parsed React components
	shouldSetSelectionRange: 0, // Should set (reset) the selection range?
	history: null,              // The history state stack
	historyIndex: 0,            // The history state stack index

	// TODO: Move to props?
	spellCheck: false,          // New flag
	previewMode: false,         // New flag
	osxFontSmoothing: false,    // New flag
	textareaOnly: false,        // New flag
	showWhiteSpace: false,      // New flag
}

const reducer = state => ({
	newAction(actionType) {
		const actionTimestamp = Date.now()
		if (actionType === ActionTypes.SELECT && actionTimestamp - state.actionTimestamp < 100) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimestamp })
	},
	focus() {
		this.newAction(ActionTypes.FOCUS)
		state.isFocused = true
	},
	blur() {
		this.newAction(ActionTypes.BLUR)
		state.isFocused = false
	},
	select(selectionStart, selectionEnd) {
		this.newAction(ActionTypes.SELECT)
		Object.assign(state, { selectionStart, selectionEnd })
	},
	collapse() {
		state.selectionEnd = state.selectionStart
	},
	change(value, selectionStart, selectionEnd, asActionType) {
		this.newAction(asActionType)
		Object.assign(state, { value, selectionStart, selectionEnd })
		this.parse()
	},
	insert(value) {
		this.newAction(ActionTypes.INSERT)
		state.value = state.value.slice(0, state.selectionStart) + value + state.value.slice(state.selectionEnd)
		state.selectionStart += value.length
		state.selectionEnd = state.selectionStart
		state.shouldSetSelectionRange++
		this.parse()
	},
	tab() {
		this.insert("\t")
	},
	copy() {
		this.newAction(ActionTypes.COPY)
	},
	parse() {
		state.components = parseComponents(state.value)
	},

	storeUndo() {
		const undoState = state.history[state.historyIndex]
		if (undoState.value === state.value) {
			// No-op
			return
		}
		const { value, selectionStart, selectionEnd } = state
		state.history.push({ value, selectionStart, selectionEnd })
		state.historyIndex++
	},
	// dropRedos() {
	// 	state.history.splice(state.historyIndex + 1)
	// },
	undo() {
		this.newAction(ActionTypes.UNDO)
		if (!state.historyIndex) {
			// No-op
			return
		} // else if (state.historyIndex === 1 && state.didWritePos) {
		//	state.didWritePos = false
		// }
		state.historyIndex--
		const undoState = state.history[state.historyIndex]
		Object.assign(state, undoState)
		state.shouldSetSelectionRange++
		this.parse()
	},
	redo() {
		this.newAction(ActionTypes.REDO)
		if (state.historyIndex + 1 === state.history.length) {
			// No-op
			return
		}
		state.historyIndex++
		const redoState = state.history[state.historyIndex]
		Object.assign(state, redoState)
		state.shouldSetSelectionRange++
		this.parse()
	},

})

// Initializes an editor state.
const init = initialValue => initialState => {
	const state = {
		...initialState,
		actionType: ActionTypes.INIT,
		actionTimestamp: Date.now(),
		value: initialValue,
		components: parseComponents(initialValue),
		history: [{ value: initialValue, selectionStart: 0, selectionEnd: 0 }],
		// historyIndex
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
