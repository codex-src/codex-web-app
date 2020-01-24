import Enum from "utils/Enum"
import { parseComponents } from "./Components"
import useMethods from "use-methods"

const OperationTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"CHANGE",
	"INSERT",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

const initialState = {
	actionType: "",             // The editing operation type
	actionTimestamp: 0,         // The editing operation timestamp
	value: "",                  // The plain text data
	spellCheck: false,          // New
	readOnly: false,            // New
	fontSmoothing: false,       // New
	hasFocus: false,            // Is the editor focused?
	selectionStart: 0,          // The start cursor
	selectionEnd: 0,            // The end cursor
	shouldSetSelectionRange: 0, // Should set (reset) the selection range?
	components: null,           // The parsed React components
}

const reducer = state => ({
	newAction(actionType) {
		const actionTimestamp = Date.now()
		if (actionType === OperationTypes.SELECT && actionTimestamp - state.actionTimestamp < 100) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimestamp })
	},
	focus() {
		this.newAction(OperationTypes.FOCUS)
		state.hasFocus = true
	},
	blur() {
		this.newAction(OperationTypes.BLUR)
		state.hasFocus = false
	},
	select(selectionStart, selectionEnd) {
		this.newAction(OperationTypes.SELECT)
		Object.assign(state, { selectionStart, selectionEnd })
	},
	collapse() {
		state.selectionEnd = state.selectionStart
	},
	change(value) {
		this.newAction(OperationTypes.CHANGE)
		state.value = value
		this.parse()
	},
	insert(value) {
		this.newAction(OperationTypes.INSERT)
		state.value = state.value.slice(0, state.selectionStart) + value + state.value.slice(state.selectionEnd)
		state.selectionStart += value.length
		state.selectionEnd = state.selectionStart
		state.shouldSetSelectionRange++
		this.parse()
	},
	tab() {
		this.insert("\t")
	},
	parse() {
		state.components = parseComponents(state.value)
	},
})

// Initializes an editor state.
const init = initialValue => initialState => {
	const state = {
		...initialState,
		actionType: OperationTypes.INIT,
		actionTimestamp: Date.now(),
		value: initialValue,
		components: parseComponents(initialValue),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
