import Enum from "utils/Enum"
import newNodes from "./helpers/newNodes"
import parseComponents from "./parseComponents"
import useMethods from "use-methods"

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
	opUnix: 0,                 // The editing operation Unix timestamp
	hasFocus: false,           // Is the editor focused?
	data: "",                  // The plain text data
	nodes: null,               // The parsed nodes
	start: null,               // The start cursor
	end: null,                 // The end cursor
	components: null,          // The parsed React components
	reactDOM: null,            // The React DOM (unmounted)
	shouldRenderComponents: 0, // Hook
}

const reducer = state => ({
	// ...
})

// Initializes the editor state.
const init = initialValue => initialState => {
	const nodes = newNodes(initialValue)
	const state = {
		...initialState,
		opType: OpTypes.INIT,
		opUnix: Date.now(),
		data: initialValue,
		nodes,
		start: {
			key: "",
			index: 0,
			offset: 0,
			pos: 0,
		},
		end: {
			key: "",
			index: 0,
			offset: 0,
			pos: 0,
		},
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
