import Enum from "utils/Enum"
import parseComponents from "./Components"
import useMethods from "use-methods"

const OperationTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"CHANGE",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

const initialState = {
	actionType: "",     // The editing operation type
	actionTimestamp: 0, // The editing operation timestamp
	value: "",          // The plain text data
	hasFocus: false,    // Is the editor focused?
	selectionStart: 0,  // The start cursor
	selectionEnd: 0,    // The end cursor
	components: null,   // The parsed React components
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
	change(value) {
		this.newAction(OperationTypes.CHANGE)
		state.value = value
		this.parse()
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
