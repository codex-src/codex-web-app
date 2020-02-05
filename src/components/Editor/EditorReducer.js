import emoji from "emoji-trie"
import Enum from "utils/Enum"
import parseComponents from "./Components"
import useMethods from "use-methods"
import utf8 from "utils/encoding/utf8"

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
	epoch: 0,           // The epoch (time stamp) of the editor
	actionType: "",     // The type of the current action
	actionTimeStamp: 0, // The time stamp (since epoch) of the current action
	focused: false,     // Is the editor focused?
	data: "",           // The plain text data
	pos1: 0,            // The start cursor
	pos2: 0,            // The end cursor
	coords: null,       // The cursor coords
	atStart: false,     // Are the cursors exclusively at the start?
	atEnd: false,       // Are the cursors exclusively at the end?
	collapsed: false,   // Are the cursors collapsed?
	components: null,   // The React components
	shouldRender: 0,    // Should render the DOM and or cursor?
	reactDOM: null,     // The React DOM (not what the user sees)
}

const reducer = state => ({
	newAction(actionType) {
		const actionTimeStamp = Date.now() - state.epoch
		if (actionType === ActionTypes.SELECT && actionTimeStamp - state.actionTimeStamp < 200) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimeStamp })
	},
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.focused = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.focused = false
	},
	actionSelect(pos1, pos2, coords) {
		this.newAction(ActionTypes.SELECT)
		const collapsed = pos1 === pos2 // Takes precedence
		const atStart = collapsed && !pos1
		const atEnd = collapsed && pos1 === state.data.length
		Object.assign(state, { pos1, pos2, coords, atStart, atEnd, collapsed })
	},
	actionInput(data, pos1, pos2, coords = state.coords) {
		this.newAction(ActionTypes.INPUT)
		Object.assign(state, { data, pos1, pos2, coords })
		this.render()
	},
	write(substr, dropL = 0, dropR = 0) { // dropL and dropR are expected to be >= 0
		const data = state.data.slice(0, state.pos1 - dropL) + substr + state.data.slice(state.pos2 + dropR)
		const pos1 = state.pos1 - dropL + substr.length
		const pos2 = pos1
		this.actionInput(data, pos1, pos2, state.coords) // Synthetic coords
	},
	backspaceRuneL() {
		let dropL = 0
		if (state.collapsed && !state.atStart) {
			// Get the rune at the end:
			const substr = state.data.slice(0, state.pos1)
			let rune = emoji.atEnd(substr)
			if (!rune) {
				rune = utf8.atEnd(substr)
			}
			dropL = rune.length
		}
		this.write("", dropL, 0)
	},
	backspaceWordL() {
		if (!state.collapsed || state.atStart) {
			this.write("", 0, 0)
			return
		}
		// Iterate (h.) white space:
		let index = state.pos1
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate non-word runes:
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Iterate word runes:
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceLineL() {
		if (!state.collapsed || state.atStart) {
			this.write("", 0, 0)
			return
		}
		let index = state.pos1
		while (index) {
			const rune = utf8.atEnd(state.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1 - index
		if (!dropL && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write("", dropL, 0)
	},
	backspaceRuneR() {
		let dropR = 0
		if (state.collapsed && !state.atEnd) {
			// Get the rune at the start:
			const substr = state.data.slice(state.pos1)
			let rune = emoji.atStart(substr)
			if (!rune) {
				rune = utf8.atStart(substr)
			}
			dropR = rune.length
		}
		this.write("", 0, dropR)
	},
	backspaceWordR() {
		if (!state.collapsed || state.atEnd) {
			this.write("", 0, 0)
			return
		}
		// Iterate (h.) white space:
		let index = state.pos1
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (!utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Iterate non-word runes:
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Iterate word runes:
		while (index < state.data.length) {
			const rune = utf8.atStart(state.data.slice(index))
			if (!utf8.isAlphanum(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Get the number of bytes to drop:
		let dropR = index - state.pos1
		if (!dropR && state.data[index] === "\n") {
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
	// NOTE: newAction(...) uses reverse order
	cut() {
		this.write("")
		this.newAction(ActionTypes.CUT)
	},
	// NOTE: newAction(...) uses reverse order
	copy() {
		// Idempotent
		this.newAction(ActionTypes.COPY)
	},
	// NOTE: newAction(...) uses reverse order
	paste(substr) {
		if (!substr) {
			// No-op
			return
		}
		this.write(substr)
		this.newAction(ActionTypes.PASTE)
	},
	render() {
		state.components = parseComponents(state.data)
		state.shouldRender++
	},
})

const init = initialValue => initialState => {
	const epoch = Date.now()
	const state = {
		...initialState,
		epoch,
		actionType: ActionTypes.INIT,
		// actionTimeStamp: Date.now() - epoch,
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
		reactDOM: document.createElement("div"),
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
