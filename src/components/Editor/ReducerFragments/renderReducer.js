import markdown from "lib/encoding/markdown"
import OperationTypes from "../OperationTypes"
import { perfParser } from "../__perf"

import {
	parseComponents,
	sameComponents,
} from "../Components"

export function renderReducer(state) {
	const dispatchers = {
		// `render` conditionally updates `shouldRender`.
		render() {
			// Get the current components and parse new components:
			const Components = state.Components.map(each => ({ ...each })) // Read proxy.
			perfParser.restart()
			const NewComponents = parseComponents(state.body)
			perfParser.stop()
			state.Components = NewComponents
			// Guard edge case at markdown start:
			//
			//  #·H<cursor> -> ["#", " "]
			// //·H<cursor> -> ["/", " "]
			//  >·H<cursor> -> [">", " "]
			//
			const markdownStart = (
				state.pos1.pos - 3 >= 0 &&
				markdown.isSyntax(state.body.data[state.pos1.pos - 3]) &&
				state.body.data[state.pos1.pos - 2] === " "
			)
			// Native rendering strategy:
			state.shouldRender += state.op !== OperationTypes.INPUT || !sameComponents(Components, NewComponents) || markdownStart
		},
		// `renderDOMCursor` updates `shouldRenderDOMCursor`.
		renderDOMCursor() {
			state.shouldRenderDOMCursor++
		},
	}
	return dispatchers
}
