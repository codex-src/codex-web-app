import Enum from "utils/Enum"
import newNodes from "./helpers/newNodes"
import parseComponents from "./parseComponents"
import useMethods from "use-methods"
import write from "./helpers/write"
import { newCursor } from "./helpers/getCursorFromKey"

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

const initialState = {
	actionType: "",     // The editing operation type
	actionTimestamp: 0, // The editing operation timestamp
	hasFocus: false,    // Is the editor focused?
	data: "",           // The plain text data
	nodes: null,        // The parsed nodes
	start: null,        // The start cursor
	end: null,          // The end cursor
	coords: null,       // The cursor coordinates
	reset: null,        // The reset cursor key and offset
	components: null,   // The parsed React components
	reactDOM: null,     // The React DOM (unmounted)
	shouldRender: 0,    // Should render? (hook)
	didRender: 0,       // Did render? (hook)
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
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.hasFocus = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.hasFocus = false
	},
	actionSelect(start, end, coords) {
		this.newAction(ActionTypes.SELECT)
		Object.assign(state, { start, end, coords })
	},
	// state.nodes.splice(start.index, end.index - start.index + 1, ...nodes)
	actionInput(nodes, start, end, coords, reset) { // TODO: coords
		this.newAction(ActionTypes.INPUT)
		write(state, nodes, start, end)
		Object.assign(state, { coords, reset })
		this.render()
	},
	FFBackspaceNode() {
		const { key, data } = state.nodes[state.start.index - 1]
		const start = {
			key,
			index: state.start.index - 1,
			offset: data.length,
			pos: state.start.pos - 1,
		}
		const reset = { key, offset: data.length }
		write(state, null, start, state.end)
		Object.assign(state, { reset })
		this.render()
	},
	FFDeleteNode() {
		const { key } = state.nodes[state.start.index + 1]
		const end = {
			key,
			index: state.start.index + 1,
			offset: 0, // Reset
			pos: state.start.pos + 1,
		}
		const reset = { key: state.start.key, offset: state.start.offset } // Idempotent
		write(state, null, state.start, end)
		Object.assign(state, { reset })
		this.render()
	},
	render(reset) {
		if (reset) {
			Object.assign(state, { reset })
		}
		const nodes = state.nodes.map(each => ({ ...each })) // Read proxy
		state.components = parseComponents(nodes)
		state.shouldRender++
	},
	rendered() {
		state.didRender++
	},
})

const init = initialValue => initialState => {
	const nodes = newNodes(initialValue)
	const state = {
		...initialState,
		actionType: ActionTypes.INIT,
		actionTimestamp: Date.now(),
		data: initialValue,
		nodes,
		start: newCursor(),
		end: newCursor(),
		coords: {
			start: {
				x: 0,
				y: 0,
			},
			end: {
				x: 0,
				y: 0,
			},
		},
		reset: {
			key: "",
			offset: 0,
		},
		components: parseComponents(nodes),
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
