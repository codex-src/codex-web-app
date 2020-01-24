import ActionTypes from "./ActionTypes"
import useMethods from "use-methods"
import { parseComponents } from "./Components"

const initialState = {
	actionType: "",             // The editing operation type
	actionTimestamp: 0,         // The editing operation timestamp
	value: "",                  // The plain text data
	hasFocus: false,            // Is the editor focused?
	selectionStart: 0,          // The start cursor
	selectionEnd: 0,            // The end cursor
	shouldSetSelectionRange: 0, // Should set (reset) the selection range?
	components: null,           // The parsed React components

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
		state.hasFocus = true
	},
	blur() {
		this.newAction(ActionTypes.BLUR)
		state.hasFocus = false
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
	// cut() {
	// 	this.newAction(ActionTypes.CUT)
	// },
	copy() {
		this.newAction(ActionTypes.COPY)
	},
	// paste() {
	// 	this.newAction(ActionTypes.PASTE)
	// },
	parse() {
		state.components = parseComponents(state.value)
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
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
