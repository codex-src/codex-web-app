import * as Components from "./Components"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import utf8 from "./utf8"
import vdom from "./vdom"

const initialState = {
	isFocused:     false,                // Is the editor focused?
	body:          new vdom.VDOM(""),    // The VDOM body.
	pos1:          traverseDOM.newPos(), // The VDOM cursor start.
	pos2:          traverseDOM.newPos(), // The VDOM cursor end.
	didCorrectPos: false,                // Did correct the VDOM cursor start and end?
	history:       [],                   // The history (and future) state stack.
	historyIndex:  -1,                   // The history (and future) state stack index.

	// `shouldRenderComponents` hints whether the editor’s
	// components should be rerendered.
	shouldRenderComponents: 0,

	// `shouldRenderPos` hints whether the editor’s cursor
	// should be rerendered.
	shouldRenderPos: 0,

	Components: [], // The rendered components.
}

const reducer = state => ({
	opFocus() {
		state.isFocused = true
	},
	opBlur() {
		state.isFocused = false
	},
	setState(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	_collapse() {
		state.pos2 = { ...state.pos1 }
	},
	opWrite(inputType, data) {
		if (!state.didCorrectPos) {
			state.history[0].pos1.pos = state.pos1.pos
			state.history[0].pos2.pos = state.pos2.pos
			state.didCorrectPos = true
		}
		this._prune()
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this._collapse()
		// // NOTE: To opt-in to native rendering, conditionally
		// // increment `shouldRenderComponents`.
		// state.shouldRenderComponents += inputType !== "onKeyPress"
		state.shouldRenderComponents++
	},
	opPrecompose(data) {
		// Compute the start and end of the affected VDOM nodes:
		const pos1 = state.pos1.pos - state.pos1.offset
		const pos2 = state.pos1.pos - state.pos1.offset + state.body.nodes[state.pos1.index].data.length
		state.body = state.body.write(data, pos1, pos2)
		// this._collapse()
		// state.shouldRenderComponents++
	},
	opCompose(data, eventData) {
		// Compute the start and end of the affected VDOM nodes:
		const pos1 = state.pos1.pos - state.pos1.offset
		const pos2 = state.pos1.pos - state.pos1.offset + state.body.nodes[state.pos1.index].data.length
		state.body = state.body.write(data, pos1, pos2)
		state.pos1.pos += eventData.slice(-1) === " "
		this._collapse()
		state.shouldRenderComponents++
	},
	// FIXME: `opInsert` or `opInsertFromSpellcheck?`
	opOverwrite(data, pos) {
		// Compute the start and end of the affected VDOM nodes:
		const pos1 = state.pos1.pos - state.pos1.offset
		const pos2 = state.pos1.pos - state.pos1.offset + state.body.nodes[state.pos1.index].data.length
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = pos
		this._collapse()
		state.shouldRenderComponents++
	},
	opTab() {
		this.opWrite("onKeyDown", "\t")
	},
	_delete(lengthL, lengthR) {
		// Guard the current node:
		if ((!state.pos1.pos && lengthL) || (state.pos2.pos === state.body.data.length && lengthR)) {
			// No-op.
			return
		}
		this.prune()
		state.body = state.body.write("", state.pos1.pos - lengthL, state.pos2.pos + lengthR)
		state.pos1.pos -= lengthL
		this._collapse()
		state.shouldRenderComponents++
	},
	opBackspace() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._delete(0, 0)
			return
		}
		const { length } = utf8.prevChar(state.body.data, state.pos1.pos)
		this._delete(length, 0)
	},
	opDelete() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._delete(0, 0)
			return
		}
		const { length } = utf8.nextChar(state.body.data, state.pos1.pos)
		this._delete(0, length)
	},
	storeUndo() {
		const undo = state.history[state.historyIndex]
		if (undo.body.data.length === state.body.data.length && undo.body.data === state.body.data) {
			// No-op.
			return
		}
		const { body, pos1, pos2 } = state
		state.history.push({ body, pos1, pos2 })
		state.historyIndex++
	},
	opUndo() {
		if (!state.historyIndex) {
			state.didCorrectPos = false
			return
		}
		state.historyIndex--
		const { body, pos1, pos2 } = state.history[state.historyIndex]
		Object.assign(state, { body, pos1, pos2 })
		state.shouldRenderComponents++
	},
	opRedo() {
		if (state.historyIndex + 1 === state.history.length) {
			// No-op.
			return
		}
		state.historyIndex++
		const { body, pos1, pos2 } = state.history[state.historyIndex]
		Object.assign(state, { body, pos1, pos2 })
		state.shouldRenderComponents++
	},
	_prune() {
		state.history.splice(state.historyIndex + 1)
	},
	render() {
		state.Components = Components.parse(state.body)
		state.shouldRenderPos++
	},
})

const init = data => state => {
	let { body, pos1, pos2 } = state
	body = body.write(data, 0, state.body.data.length)
	const newState = {
		...state,
		body,
		history: [{ body, pos1, pos2 }],
		historyIndex: 0,
		Components: Components.parse(body),
	}
	return newState
}

const useTestEditor = (data = "") => useMethods(reducer, initialState, init(data))

export default useTestEditor
