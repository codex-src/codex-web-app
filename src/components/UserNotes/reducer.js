import * as consts from "./consts"
import useMethods from "use-methods"

const initialState = {
	itemsShown: consts.ITEMS_DEFAULT,
	itemsShownModifier: consts.ITEMS_MODIFIER,
	sortAscending: false,
}

const reducer = state => ({
	showLessItems() {
		if (state.itemsShown === consts.ITEMS_MIN) {
			// No-op
			return
		}
		state.itemsShown--
		state.itemsShownModifier = consts.ITEMS_MODIFIER * consts.ITEMS_DEFAULT / state.itemsShown
	},
	showMoreItems() {
		if (state.itemsShown === consts.ITEMS_MAX) {
			// No-op
			return
		}
		state.itemsShown++
		state.itemsShownModifier = consts.ITEMS_MODIFIER * consts.ITEMS_DEFAULT / state.itemsShown
	},
	toggleSortDirection() {
		state.sortAscending = !state.sortAscending
	},
})

function useUserNotes() {
	return useMethods(reducer, initialState)
}

export default useUserNotes
