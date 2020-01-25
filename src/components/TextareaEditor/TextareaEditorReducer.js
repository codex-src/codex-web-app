import ActionTypes from "./ActionTypes"
import useMethods from "use-methods"
import { parseComponents } from "./Components"

const initialState = {
	actionType: "",             // The editing operation type
	actionTimestamp: 0,         // The editing operation timestamp
	                            //
	isFocused: false,           // Is the editor focused?
	data: "",                   // The plain text data
	pos1: 0,                    // The start cursor
	pos2: 0,                    // The end cursor
	coords: null,               // The cursor coordinates
	                            //
	components: null,           // The parsed React components
	shouldRenderComponents: 0,  // Should render React components? (hook)
	shouldRenderCursor: 0,      // Should render the DOM cursor? (hook)
	                            //
	didOffsetPos: false,        // Did offset the selection range? (once)
	history: null,              // The history state stack
	historyIndex: 0,            // The history state stack index
	                            //
	// spellCheck: false,       // New flag
	// previewMode: false,      // New flag
	// osxFontSmoothing: false, // New flag
	// textareaOnly: false,     // New flag
	// showWhiteSpace: false,   // New flag
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
	select(pos1, pos2, coords = state.coords) {
		this.newAction(ActionTypes.SELECT)
		Object.assign(state, { pos1, pos2, coords })
	},
	collapse() {
		state.pos2 = state.pos1
	},
	change(actionType, data, pos1, pos2) {
		this.newAction(actionType)
		if (!state.historyIndex && !state.didOffsetPos) {
			state.history[0].pos1 = state.pos1
			state.history[0].pos2 = state.pos2
			state.didOffsetPos = true
		}
		this.dropRedos()
		Object.assign(state, { data, pos1, pos2 })
		this.parse()
	},
	// insert(data) {
	// 	const _value = state.data.slice(0, state.pos1) + data + state.data.slice(state.pos2)
	// 	const pos1 = state.pos1 + data.length
	// 	this.change(ActionTypes.INSERT, _value, pos1, pos1)
	// 	state.shouldRenderCursor++
	// },
	tab() {
		this.insert("\t")
	},
	copy() {
		this.newAction(ActionTypes.COPY)
	},
	//
	parse() {
		const t1 = Date.now()
		state.components = parseComponents(state.data)
		const t2 = Date.now()
		console.log(`parser=${t2 - t1}`)
		state.shouldRenderComponents++
	},
	storeUndo() {
		const undo = state.history[state.historyIndex]
		if (undo.data === state.data) {
			// No-op
			return
		}
		const { data, pos1, pos2 } = state
		state.history.push({ data, pos1, pos2 })
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
		} else if (state.historyIndex === 1 && state.didOffsetPos) {
			state.didOffsetPos = false
		}
		state.historyIndex--
		const undo = state.history[state.historyIndex]
		Object.assign(state, undo)
		state.shouldRenderCursor++
		this.parse()
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
		state.shouldRenderCursor++
		this.parse()
	},
})

// Initializes an editor state.
const init = initialValue => initialState => {
	const state = {
		...initialState,
		actionType: ActionTypes.INIT,
		actionTimestamp: Date.now(),
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
		history: [
			{
				data: initialValue,
				pos1: 0,
				pos2: 0,
			},
		],
		// historyIndex
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
