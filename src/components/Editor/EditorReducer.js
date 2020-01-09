import parse from "./Components"
import useMethods from "use-methods"
import utf8 from "lib/encoding/utf8"
import VDOM from "./VDOM"
import { newVDOMCursor } from "./traverseDOM"

const initialState = {
	isFocused: false,           // Is the editor focused?
	body:      new VDOM(""),    // The VDOM body.
	pos1:      newVDOMCursor(), // The VDOM cursor start.
	pos2:      newVDOMCursor(), // The VDOM cursor end.

	// `shouldRenderDOMComponents` hints whether the editor’s
	// DOM components should be rendered.
	shouldRenderDOMComponents: 0,

	// `shouldRenderDOMCursor` hints whether the editor’s DOM
	// cursor should be rendered.
	shouldRenderDOMCursor: 0,

	reactDOM: document.createElement("div"), // The React rendered DOM.
}

const reducer = state => ({
	focus() {
		state.isFocused = true
	},
	blur() {
		state.isFocused = false
	},
	select(body, pos1, pos2) {
		if (pos1.pos > pos2.pos) {
			[pos1, pos2] = [pos2, pos1]
		}
		Object.assign(state, { body, pos1, pos2 })
	},
	// `_collapse` collapses the VDOM cursors to the start.
	_collapse() {
		state.pos2 = { ...state.pos1 }
	},
	// `write` writes and renders.
	write(shouldRender, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this._collapse()
		this.renderDOMComponents(shouldRender)
	},
	// `greedyWrite` greedily writes and renders.
	greedyWrite(shouldRender, data, pos1, pos2, resetPos) {
		state.body = state.body.write(data, pos1, pos2)
		state.pos1 = resetPos
		this._collapse()
		this.renderDOMComponents(shouldRender)
	},
	tab() {
		this.write(true, "\t")
	},
	enter() {
		this.write(true, "\n")
	},
	_drop(delL, delR) {
		// Guard the anchor node or focus node:
		if ((!state.pos1.pos && delL) || (state.pos2.pos === state.body.data.length && delR)) {
			// No-op.
			this.renderDOMComponents(true) // Rerender to be safe.
			return
		}
		state.body = state.body.write("", state.pos1.pos - delL, state.pos2.pos + delR)
		state.pos1.pos -= delL
		this._collapse()
		this.renderDOMComponents(true)
	},
	backspace() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		const { length } = utf8.endRune(state.body.data.slice(0, state.pos1.pos))
		this._drop(length, 0)
	},
	backspaceWord() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		// Iterate spaces:
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isHWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate non-word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isAlphanum(rune) || utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		// Iterate word characters:
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (!utf8.isAlphanum(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this._drop(length || 1, 0) // Must delete one or more characters.
	},
	backspaceLine() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		let index = state.pos1.pos
		while (index) {
			const rune = utf8.endRune(state.body.data.slice(0, index))
			if (utf8.isVWhiteSpace(rune)) {
				break
			}
			index -= rune.length
		}
		const length = state.pos1.pos - index
		this._drop(length || 1, 0) // Must delete one or more characters.
	},
	delete() {
		if (state.pos1.pos !== state.pos2.pos) {
			this._drop(0, 0)
			return
		}
		const { length } = utf8.startRune(state.body.data.slice(state.pos1.pos))
		this._drop(0, length)
	},

	renderDOMComponents(shouldRender) {
		state.shouldRenderDOMComponents += shouldRender
	},
	renderDOMCursor() {
		state.shouldRenderDOMCursor++
	},
})

const init = initialValue => initialState => {
	const body = initialState.body.write(initialValue, 0, initialState.body.data.length)
	const state = {
		...initialState,
		body,
		Components: parse(body),
	}
	return state
}

function useEditor(initialValue = "") {
	return useMethods(reducer, initialState, init(initialValue))
}

export default useEditor
