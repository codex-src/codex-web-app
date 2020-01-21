import Enum from "utils/Enum"
import newNodes from "./helpers/newNodes"
import parseComponents from "./parseComponents"
import useMethods from "use-methods"
import { newCursor } from "./helpers/getCursorFromKey"

const OpTypes = new Enum(
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

const initialState = {
	opType: "",                // The editing operation type
	opTimestamp: 0,            // The editing operation timestamp
	hasFocus: false,           // Is the editor focused?
	data: "",                  // The plain text data
	nodes: null,               // The parsed nodes
	start: null,               // The start cursor
	end: null,                 // The end cursor
	components: null,          // The parsed React components
	reactDOM: null,            // The React DOM (unmounted)
	shouldRenderComponents: 0, // Should render components hook
}

const reducer = state => ({
	// Commits an editing operation.
	commitOp(opType) {
		const opTimestamp = Date.now()
		if (opType === OpTypes.SELECT && opTimestamp - state.opTimestamp < 100) {
			// No-op
			return
		}
		Object.assign(state, { opType, opTimestamp })
	},
	// Focuses the editor.
	opFocus() {
		this.commitOp(OpTypes.FOCUS)
		state.hasFocus = true
	},
	// Blurs the editor.
	opBlur() {
		this.commitOp(OpTypes.BLUR)
		state.hasFocus = false
	},
	// Selects the editor.
	opSelect(start, end) {
		this.commitOp(OpTypes.SELECT)
		Object.assign(state, { start, end })
	},
})

// Initializes the editor state.
const init = initialValue => initialState => {
	const nodes = newNodes(initialValue)
	const state = {
		...initialState,
		opType: OpTypes.INIT,
		opTimestamp: Date.now(),
		data: initialValue,
		nodes,
		start: newCursor(),
		end: newCursor(),
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
