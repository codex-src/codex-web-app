import emoji from "emoji-trie"
import Enum from "utils/Enum"
import parseComponents from "./Components"
import random from "utils/random/id"
import useMethods from "use-methods"
import utf8 from "utils/encoding/utf8"

const ActionTypes = new Enum(
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
	// Preferences:
	prefersMonoStylesheet: false,
	prefersReadOnlyMode: false,
	prefersTextBackground: false,
	// prefersScrollPastEnd: true, // TODO
	prefersClassName: "prefers-text-stylesheet",

	// Reducer:
	actionType: "",      // The type of the current action
	actionTimeStamp: 0,  // The time stamp of the current action
	isFocused: false,    // Is the editor focused?
	hasSelection: false, // Does the editor have a selection?
	data: "",            // The plain text data
	body: null,          // The parsed nodes
	pos1: null,          // The start cursor
	pos2: null,          // The end cursor
	components: null,    // The React components
	shouldRender: 0,     // Should rerender the React components?
	didRender: 0,        // Did rerender the React components?
	reactDOM: null,      // The React DOM (not what the user sees)
	history: [],         // The history state stack
	historyIndex: 0,     // The history state stack index
	didSetPos: false,    // Did set the cursors before the first write?
}

function newNodes(data) {
	const body = data.split("\n").map(each => ({
		key: random.newUUID(), // The key.
		data: each,            // The plain text data.
	}))
	return body
}

// Creates a new cursor object.
function newPos() {
	const pos = {
		x: 0,
		y: 0,
		pos: 0,
	}
	return pos
}

const reducer = state => ({
	// Preferences:
	updatedPrefs() {
		const classNames = []
		// Prefers mono stylesheet:
		if (/* state.prefersReadOnlyMode || */ !state.prefersMonoStylesheet) {
			classNames.push("prefers-text-stylesheet")
		} else {
			classNames.push("prefers-mono-stylesheet")
		}
		// Prefers text background:
		if (!state.prefersReadOnlyMode && state.prefersTextBackground) {
			classNames.push("prefers-text-background")
		}
		// Prefers read-only mode:
		if (state.prefersReadOnlyMode) {
			classNames.push("prefers-read-only-mode")
		}
		state.prefersClassName = classNames.join(" ")
	},
	preferTextStylesheet() {
		state.prefersMonoStylesheet = false
		this.updatedPrefs()
	},
	preferMonoStylesheet() {
		state.prefersMonoStylesheet = true
		this.updatedPrefs()
	},
	preferTextBackground() {
		state.prefersReadOnlyMode = false // Reset
		state.prefersTextBackground = !state.prefersTextBackground
		this.updatedPrefs()
	},
	toggleReadOnlyMode() {
		state.prefersReadOnlyMode = !state.prefersReadOnlyMode
		this.updatedPrefs()
	},

	// Reducer:
	newAction(actionType) {
		const actionTimeStamp = Date.now()
		if (actionType === ActionTypes.SELECT && actionTimeStamp - state.actionTimeStamp < 200) {
			// No-op
			return
		}
		Object.assign(state, { actionType, actionTimeStamp })
	},
	actionFocus() {
		this.newAction(ActionTypes.FOCUS)
		state.isFocused = true
	},
	actionBlur() {
		this.newAction(ActionTypes.BLUR)
		state.isFocused = false // Reset
	},
	actionSelect(pos1, pos2) {
		this.newAction(ActionTypes.SELECT)
		const hasSelection = pos1.pos !== pos2.pos
		Object.assign(state, { hasSelection, pos1, pos2 })
	},
	actionInput2(nodes, atEnd, pos1, pos2) {
		// Create a new action:
		this.newAction(ActionTypes.INPUT)
		if (!state.historyIndex && !state.didSetPos) {
			Object.assign(state.history[0], {
				pos1: state.pos1,
				pos2: state.pos2,
			})
			state.didSetPos = true
		}
		this.dropRedos()

		// Update body:
		const key1 = nodes[0].key
		const key2 = nodes[nodes.length - 1].key
		
		let index1 = -1;
		let index2 = -1;
		if(atEnd){
			index2 = state.body.length - 1;
		}
		for(let i = 0; i < state.body.length; i++) {
			let item = state.body[i];
			if(index1 === -1 && item.key === key1){
				index1 = i;
			}
			if(index2 === -1 && item.key === key2){
				index2 = i;
			}
			if(index1 !== -1 && index2 !== -1){
				break;
			}
		}

		if (index1 === -1 || index2 === -1) {
			throw new Error("FIXME")
		}

		state.body.splice(index1, (index2 + 1) - index1, ...nodes)
		// Update data, pos1, and pos2:
		const data = state.body.map(each => each.data).join("\n")
		Object.assign(state, { data, pos1, pos2 })
		this.render()
	},
	write2(substr, dropL = 0, dropR = 0) {
		// Create a new action:
		this.newAction(ActionTypes.INPUT)
		if (!state.historyIndex && !state.didSetPos) {
			Object.assign(state.history[0], {
				pos1: state.pos1,
				pos2: state.pos2,
			})
			state.didSetPos = true
		}
		this.dropRedos()
		// Drop bytes (L):
		state.pos1.pos -= dropL
		while (dropL) {
			const bytesToStart = state.pos1.x
			if (dropL <= bytesToStart) {
				state.pos1.x -= dropL
				dropL = 0
				break // XOR
			}
			dropL -= bytesToStart + 1
			state.pos1.y--
			state.pos1.x = state.body[state.pos1.y].data.length
		}
		// Drop bytes (R):
		state.pos2.pos += dropR
		while (dropR) {
			const bytesToEnd = state.body[state.pos2.y].data.length - state.pos2.x
			if (dropR <= bytesToEnd) {
				state.pos2.x += dropR
				dropR = 0
				break // XOR
			}
			dropR -= bytesToEnd + 1
			state.pos2.y++
			state.pos2.x = 0 // Reset
		}
		// Parse the new nodes:
		const nodes = newNodes(substr)
		const startNode = state.body[state.pos1.y]
		const endNode = { ...state.body[state.pos2.y] } // Create a new reference
		// Start node:
		startNode.data = startNode.data.slice(0, state.pos1.x) + nodes[0].data
		state.body.splice(state.pos1.y + 1, state.pos2.y - state.pos1.y, ...nodes.slice(1))
		// End node:
		let node = startNode
		if (nodes.length > 1) {
			node = nodes[nodes.length - 1]
		}
		node.data += endNode.data.slice(state.pos2.x)
		// Update data, pos1, and pos2:
		const data = state.body.map(each => each.data).join("\n")
		const pos1 = { ...state.pos1, pos: state.pos1.pos + substr.length }
		const pos2 = { ...pos1 }
		Object.assign(state, { data, pos1, pos2 })
		this.render()
	},
	backspaceChar() {
		let dropL = 0
		if (!state.hasSelection && state.pos1.pos) { // Inverse
			const substr = state.data.slice(0, state.pos1.pos)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			dropL = rune.length
		}
		this.write2("", dropL, 0)
	},
	backspaceWord() {
		if (state.hasSelection) {
			this.write2("")
			return
		}
		// Iterate to a non-h. white space:
		let index = state.pos1.pos
		while (index) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!rune || !utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the next rune:
		const substr = state.data.slice(0, index)
		const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// Iterate to an alphanumeric rune OR a non-alphanumeric
		// rune based on the next rune:
		if (rune && !utf8.isAlphanum(rune)) {
			// Iterate to an alphanumeric rune:
			while (index) {
				const substr = state.data.slice(0, index)
				const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
				if (!rune || utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
					// No-op
					break
				}
				index -= rune.length
			}
		} else if (rune && utf8.isAlphanum(rune)) {
			// Iterate to a non-alphanumeric rune:
			while (index) {
				const substr = state.data.slice(0, index)
				const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
				if (!rune || !utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
					// No-op
					break
				}
				index -= rune.length
			}
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1.pos - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write2("", dropL, 0)
	},
	backspaceLine() {
		if (state.hasSelection) {
			this.write2("")
			return
		}
		// Iterate to a v. white space rune:
		let index = state.pos1.pos
		while (index >= 0) {
			const substr = state.data.slice(0, index)
			const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
			if (!rune || utf8.isVWhiteSpace(rune)) {
				// No-op
				break
			}
			index -= rune.length
		}
		// Get the number of bytes to drop:
		let dropL = state.pos1.pos - index
		if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
			dropL = 1
		}
		this.write2("", dropL, 0)
	},
	backspaceCharForwards() {
		let dropR = 0
		if (!state.hasSelection && state.pos1.pos < state.data.length) { // Inverse
			const substr = state.data.slice(state.pos1.pos)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			dropR = rune.length
		}
		this.write2("", 0, dropR)
	},
	backspaceWordForwards() {
		if (state.hasSelection) {
			this.write2("")
			return
		}
		// Iterate to a non-h. white space:
		let index = state.pos1.pos
		while (index < state.data.length) {
			const substr = state.data.slice(index)
			const rune = emoji.atStart(substr) || utf8.atStart(substr)
			if (!rune || !utf8.isHWhiteSpace(rune)) {
				// No-op
				break
			}
			index += rune.length
		}
		// Get the next rune:
		const substr = state.data.slice(index)
		const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// Iterate to an alphanumeric rune OR a non-alphanumeric
		// rune based on the next rune:
		if (rune && !utf8.isAlphanum(rune)) {
			// Iterate to an alphanumeric rune:
			while (index < state.data.length) {
				const substr = state.data.slice(index)
				const rune = emoji.atStart(substr) || utf8.atStart(substr)
				if (!rune || utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
					// No-op
					break
				}
				index += rune.length
			}
		} else if (rune && utf8.isAlphanum(rune)) {
			// Iterate to a non-alphanumeric rune:
			while (index < state.data.length) {
				const substr = state.data.slice(index)
				const rune = emoji.atStart(substr) || utf8.atStart(substr)
				if (!rune || !utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
					// No-op
					break
				}
				index += rune.length
			}
		}
		// Get the number of bytes to drop:
		let dropR = index - state.pos1.pos
		if (!dropR && index < state.data.length && state.data[index] === "\n") {
			dropR = 1
		}
		this.write2("", 0, dropR)
	},
	tab() {
		this.write2("\t")
	},
	enter() {
		this.write2("\n")
	},
	cut() {
		this.newAction(ActionTypes.CUT)
		this.write2("")
	},
	copy() {
		this.newAction(ActionTypes.COPY)
	},
	paste(substr) {
		this.newAction(ActionTypes.PASTE)
		this.write2(substr)
	},
	storeUndo() {
		const undo = state.history[state.historyIndex]
		if (undo.data.length === state.data.length && undo.data === state.data) {
			// No-op
			return
		}
		const { data, body, pos1, pos2 } = state
		state.history.push({ data, body: body.map(each => ({ ...each })), pos1: { ...pos1 }, pos2: { ...pos2 } })
		state.historyIndex++
	},
	dropRedos() {
		state.history.splice(state.historyIndex + 1)
	},
	undo() {
		if (state.prefersReadOnlyMode) {
			// No-op
			return
		}
		this.newAction(ActionTypes.UNDO)
		if (state.historyIndex === 1 && state.didSetPos) {
			state.didSetPos = false
		}
		// Guard decrement:
		if (state.historyIndex) {
			state.historyIndex--
		}
		const undo = state.history[state.historyIndex]
		Object.assign(state, undo)
		this.render()
	},
	redo() {
		if (state.prefersReadOnlyMode) {
			// No-op
			return
		}
		this.newAction(ActionTypes.REDO)
		if (state.historyIndex + 1 === state.history.length) {
			// No-op
			return
		}
		state.historyIndex++
		const redo = state.history[state.historyIndex]
		Object.assign(state, redo)
		this.render()
	},
	render() {
		state.components = parseComponents(state.body)
		state.shouldRender++
	},
	rendered() {
		state.didRender++
	},
})

const init = data => initialState => {
	const body = newNodes(data)
	const state = {
		...initialState,
		data,
		body,
		pos1: newPos(),
		pos2: newPos(),
		components: parseComponents(body),
		reactDOM: document.createElement("div"),
		history: [{ data, body, pos1: newPos(), pos2: newPos() }],
	}
	return state
}

const useEditor = data => useMethods(reducer, initialState, init(data))

export default useEditor
