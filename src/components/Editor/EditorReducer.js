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
	prefersTextBackground: true,
	prefersScrollPastEnd: true, // TODO
	prefersClassName: "prefers-text-stylesheet prefers-text-background",
	//
	// Reducer:
	epoch: 0,            // The epoch (time stamp) of the editor
	actionType: "",      // The type of the current action
	actionTimeStamp: 0,  // The time stamp (since epoch) of the current action
	isFocused: false,    // Is the editor focused?
	hasSelection: false, // Does the editor have a selection?
	data: "",            // The plain text data

	body: null,

	pos1: null,          // The start cursor
	pos2: null,          // The end cursor
	// coords: null,     // The cursor coords
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

// // Creates a new coords object.
// function newCoords() {
// 	const coords = {
// 		x: 0,
// 		y: 0,
// 	}
// 	return coords
// }

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
		// state.prefersReadOnlyMode = false // Reset
		state.prefersMonoStylesheet = false
		this.updatedPrefs()
	},
	preferMonoStylesheet() {
		// state.prefersReadOnlyMode = false // Reset
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
	//
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
		state.pos1 = newPos()   // Reset
		state.pos2 = newPos()   // Reset
		state.isFocused = false // Reset
	},
	actionSelect(pos1, pos2) {
		this.newAction(ActionTypes.SELECT)
		const hasSelection = pos1.pos !== pos2.pos
		Object.assign(state, { hasSelection, pos1, pos2 })
	},
	actionInput(data, pos1, pos2) {
		this.newAction(ActionTypes.INPUT)
		if (!state.historyIndex && !state.didSetPos) {
			const [undo] = state.history
			undo.pos1.pos = state.pos1.pos
			undo.pos2.pos = state.pos2.pos
			state.didSetPos = true
		}
		this.dropRedos()
		Object.assign(state, { data, pos1, pos2 })
		this.render()
	},
	actionInput2(nodes, pos1, pos2, resetPos) {
		this.newAction(ActionTypes.INPUT)

		// if (!state.historyIndex && !state.didSetPos) {
		// 	const [undo] = state.history
		// 	undo.pos1.pos = state.pos1.pos
		// 	undo.pos2.pos = state.pos2.pos
		// 	state.didSetPos = true
		// }
		// this.dropRedos()

		// Update data:
		const data = (
			state.data.slice(0, pos1) +
			nodes.map(each => each.data).join("\n") +
			state.data.slice(pos2)
		)
		// Update body:
		const key1 = nodes[0].key
		const key2 = nodes[nodes.length - 1].key
		const index1 = state.body.findIndex(each => each.key === key1)
		const index2 = state.body.findIndex(each => each.key === key2)
		state.body.splice(index1, index2 - index1 + 1, ...nodes)
		// Update pos1 and pos2:
		Object.assign(state, { data, pos1: resetPos, pos2: resetPos })
		this.render()
	},
	write(substr, dropL = 0, dropR = 0) {
		if (!state.historyIndex && !state.didSetPos) {
			const [undo] = state.history
			undo.pos1.pos = state.pos1.pos
			undo.pos2.pos = state.pos2.pos
			state.didSetPos = true
		}
		this.dropRedos()
		state.data = state.data.slice(0, state.pos1.pos - dropL) + substr + state.data.slice(state.pos2.pos + dropR)
		state.pos1.pos = state.pos1.pos - dropL + substr.length
		state.pos2.pos = state.pos1.pos
		this.render()
	},

	write2(substr, dropL = 0, dropR = 0) { // FIXME: dropL and dropR
		// Parse nodes from substr:
		const nodes = newNodes(substr)
		// Merge the start node:
		Object.assign(nodes[0], {
			...state.body[state.pos1.y],
			data: state.body[state.pos1.y].data.slice(0, state.pos1.x - dropL) + nodes[0].data
		})
		// Merge the end node:
		nodes.push({
			...state.body[state.pos2.y],
			data: nodes[nodes.length - 1].data + state.body[state.pos2.y].data.slice(state.pos2.x + dropR)
		})
		if (state.pos1.y === state.pos2.y) {
			nodes[nodes.length - 1].key = state.body[state.pos2.y + 1].key // random.newUUID()
		}
		// Get the cursors:
		const pos1 = state.pos1.pos - state.pos1.x
		const pos2 = state.pos2.pos - state.pos2.x + state.body[state.pos2.y].data.length
		const resetPos = { ...state.pos1, pos: state.pos1.pos - dropL + substr.length }
		// Done:
		// console.log({ nodes, pos1, pos2, resetPos }) // DELETEME
		this.actionInput2(nodes, pos1, pos2, resetPos)
	},

	backspaceChar() {
		// let dropL = 0
		// if (!state.hasSelection && state.pos1.pos) { // Inverse
		// 	const substr = state.data.slice(0, state.pos1.pos)
		// 	const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// 	dropL = rune.length
		// }
		// this.write("", dropL, 0)
	},
	backspaceWord() {
		// if (state.hasSelection) {
		// 	this.write("")
		// 	return
		// }
		// // Iterate to a non-h. white space:
		// let index = state.pos1.pos
		// while (index) {
		// 	const substr = state.data.slice(0, index)
		// 	const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// 	if (!rune || !utf8.isHWhiteSpace(rune)) {
		// 		// No-op
		// 		break
		// 	}
		// 	index -= rune.length
		// }
		// // Get the next rune:
		// const substr = state.data.slice(0, index)
		// const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// // Iterate to an alphanumeric rune OR a non-alphanumeric
		// // rune based on the next rune:
		// if (rune && !utf8.isAlphanum(rune)) {
		// 	// Iterate to an alphanumeric rune:
		// 	while (index) {
		// 		const substr = state.data.slice(0, index)
		// 		const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// 		if (!rune || utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
		// 			// No-op
		// 			break
		// 		}
		// 		index -= rune.length
		// 	}
		// } else if (rune && utf8.isAlphanum(rune)) {
		// 	// Iterate to a non-alphanumeric rune:
		// 	while (index) {
		// 		const substr = state.data.slice(0, index)
		// 		const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// 		if (!rune || !utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
		// 			// No-op
		// 			break
		// 		}
		// 		index -= rune.length
		// 	}
		// }
		// // Get the number of bytes to drop:
		// let dropL = state.pos1.pos - index
		// if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
		// 	dropL = 1
		// }
		// this.write("", dropL, 0)
	},
	backspaceLine() {
		// if (state.hasSelection) {
		// 	this.write("")
		// 	return
		// }
		// // Iterate to a v. white space rune:
		// let index = state.pos1.pos
		// while (index >= 0) {
		// 	const substr = state.data.slice(0, index)
		// 	const rune = emoji.atEnd(substr) || utf8.atEnd(substr)
		// 	if (!rune || utf8.isVWhiteSpace(rune)) {
		// 		// No-op
		// 		break
		// 	}
		// 	index -= rune.length
		// }
		// // Get the number of bytes to drop:
		// let dropL = state.pos1.pos - index
		// if (!dropL && index - 1 >= 0 && state.data[index - 1] === "\n") {
		// 	dropL = 1
		// }
		// this.write("", dropL, 0)
	},
	backspaceCharForwards() {
		// let dropR = 0
		// if (!state.hasSelection && state.pos1.pos < state.data.length) { // Inverse
		// 	const substr = state.data.slice(state.pos1.pos)
		// 	const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// 	dropR = rune.length
		// }
		// this.write("", 0, dropR)
	},
	backspaceWordForwards() {
		// if (state.hasSelection) {
		// 	this.write("")
		// 	return
		// }
		// // Iterate to a non-h. white space:
		// let index = state.pos1.pos
		// while (index < state.data.length) {
		// 	const substr = state.data.slice(index)
		// 	const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// 	if (!rune || !utf8.isHWhiteSpace(rune)) {
		// 		// No-op
		// 		break
		// 	}
		// 	index += rune.length
		// }
		// // Get the next rune:
		// const substr = state.data.slice(index)
		// const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// // Iterate to an alphanumeric rune OR a non-alphanumeric
		// // rune based on the next rune:
		// if (rune && !utf8.isAlphanum(rune)) {
		// 	// Iterate to an alphanumeric rune:
		// 	while (index < state.data.length) {
		// 		const substr = state.data.slice(index)
		// 		const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// 		if (!rune || utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
		// 			// No-op
		// 			break
		// 		}
		// 		index += rune.length
		// 	}
		// } else if (rune && utf8.isAlphanum(rune)) {
		// 	// Iterate to a non-alphanumeric rune:
		// 	while (index < state.data.length) {
		// 		const substr = state.data.slice(index)
		// 		const rune = emoji.atStart(substr) || utf8.atStart(substr)
		// 		if (!rune || !utf8.isAlphanum(rune) || utf8.isWhiteSpace(rune)) {
		// 			// No-op
		// 			break
		// 		}
		// 		index += rune.length
		// 	}
		// }
		// // Get the number of bytes to drop:
		// let dropR = index - state.pos1.pos
		// if (!dropR && index < state.data.length && state.data[index] === "\n") {
		// 	dropR = 1
		// }
		// this.write("", 0, dropR)
	},
	tab() {
		// this.write("\t")
	},
	enter() {
		this.write2("\n")
	},
	cut() {
		// this.newAction(ActionTypes.CUT)
		// this.write("")
	},
	copy() {
		// this.newAction(ActionTypes.COPY)
	},
	paste(substr) {
		// this.newAction(ActionTypes.PASTE)
		// this.write(substr)
	},
	storeUndo() {
		const undo = state.history[state.historyIndex]
		// && undo.pos1.pos === state.pos1.pos && undo.pos2.pos === state.pos2.pos) {
		if (undo.data === state.data) {
			// No-op
			return
		}
		const { data, pos1, pos2 } = state
		state.history.push({ data, pos1: { ...pos1 }, pos2: { ...pos2 } })
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
		if (!state.historyIndex) {
			// No-op
			return
		} else if (state.historyIndex === 1 && state.didSetPos) {
			state.didSetPos = false
		}
		state.historyIndex--
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

const init = initialValue => initialState => {
	const body = newNodes(initialValue)
	const state = {
		...initialState,
		data: initialValue,
		body,
		pos1: newPos(),
		pos2: newPos(),
		components: parseComponents(body),
		reactDOM: document.createElement("div"),
		history: [{ data: initialValue, pos1: newPos(), pos2: newPos() }],
	}
	return state
}

const useEditor = initialValue => useMethods(reducer, initialState, init(initialValue))

export default useEditor
