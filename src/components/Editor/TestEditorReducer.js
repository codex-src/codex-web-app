import * as Components from "./Components"
import traverseDOM from "./traverseDOM"
import useMethods from "use-methods"
import utf8 from "./utf8"
import vdom from "./vdom"

const initialState = {
	isFocused: false,                // Is the editor focused?
	body:      new vdom.VDOM(""),    // The VDOM body.
	pos1:      traverseDOM.newPos(), // The VDOM cursor start.
	pos2:      traverseDOM.newPos(), // The VDOM cursor end.

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
	collapse() {
		state.pos2 = { ...state.pos1 }
	},
	opWrite(inputType, data) {
		state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
		state.pos1.pos += data.length
		this.collapse()
		// // NOTE: To opt-in to native rendering, conditionally
		// // increment `shouldRenderComponents`.
		// state.shouldRenderComponents += inputType !== "onKeyPress"
		state.shouldRenderComponents++
	},
	opTab() {
		this.opWrite("onKeyDown", "\t")
	},
	delete(lengthL, lengthR) {
		// Guard the current node:
		if ((!state.pos1.pos && lengthL) || (state.pos2.pos === state.body.data.length && lengthR)) {
			// No-op.
			return
		}
		state.body = state.body.write("", state.pos1.pos - lengthL, state.pos2.pos + lengthR)
		state.pos1.pos -= lengthL
		this.collapse()
		state.shouldRenderComponents++
	},
	opBackspace() {
		if (state.pos1.pos !== state.pos2.pos) {
			this.delete(0, 0)
			return
		}
		const { length } = utf8.prevChar(state.body.data, state.pos1.pos)
		this.delete(length, 0)
	},
	render() {
		state.Components = Components.parse(state.body)
		state.shouldRenderPos++
	},
})

// NOTE: `init` is a higher-order function that prevents
// `new VDOM` from creating a new VDOM per render.
const init = data => state => {
	const body = state.body.write(data, 0, state.body.data.length)
	const newState = {
		...state,
		body,
		Components: Components.parse(body),
	}
	return newState
}

const useTestEditor = (data = "") => useMethods(reducer, initialState, init(data))

export default useTestEditor
