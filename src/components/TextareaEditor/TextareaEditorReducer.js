import ActionTypes from "./ActionTypes"
import useMethods from "use-methods"
import { parseComponents } from "./Components"

const initialState = {
	actionType: "",     // The editing operation type
	actionTimestamp: 0, // The editing operation timestamp
	                    //
	isFocused: false,   // Is the editor focused?
	data: "",           // The plain text data
	pos1: 0,            // The start cursor
	pos2: 0,            // The end cursor
	coords: null,       // The cursor coordinates
	                    //
	components: null,   // The parsed React components
	shouldRender: 0,    // Should render React components? (hook)
}

// spellCheck: false,       // New flag
// previewMode: false,      // New flag
// osxFontSmoothing: false, // New flag
// textareaOnly: false,     // New flag
// showWhiteSpace: false,   // New flag

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
		Object.assign(state, { data, pos1, pos2 })
		this.parse()
	},
	tab() {
		this.insert("\t")
	},
	copy() {
		this.newAction(ActionTypes.COPY)
	},
	//
	parse() {
		// const t1 = Date.now()
		state.components = parseComponents(state.data)
		// const t2 = Date.now()
		// console.log(`parser=${t2 - t1}`)
		state.shouldRender++
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
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
