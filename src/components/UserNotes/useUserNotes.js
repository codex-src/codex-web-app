import useMethods from "use-methods"

import {
	ITEMS_SHOWN_DEFAULT,
	ITEMS_SHOWN_MAX,
	ITEMS_SHOWN_MIN,
	ITEMS_SHOWN_MODIFIER,
} from "./__globals"

const initialState = {
	itemsShown: ITEMS_SHOWN_DEFAULT,
	itemsShownModifier: ITEMS_SHOWN_MODIFIER,
	sortAscending: false,
	// scrollEnabled: false,
}

const reducer = state => ({
	showLessItems() {
		if (state.itemsShown === ITEMS_SHOWN_MIN) {
			// No-op
			return
		}
		state.itemsShown--
		state.itemsShownModifier = ITEMS_SHOWN_MODIFIER * ITEMS_SHOWN_DEFAULT / state.itemsShown
	},
	showMoreItems() {
		if (state.itemsShown === ITEMS_SHOWN_MAX) {
			// No-op
			return
		}
		state.itemsShown++
		state.itemsShownModifier = ITEMS_SHOWN_MODIFIER * ITEMS_SHOWN_DEFAULT / state.itemsShown
	},
	toggleSortDirection() {
		state.sortAscending = !state.sortAscending
	},
	toggleScrollEnabled() {
		// state.scrollEnabled = !state.scrollEnabled
	},
})

function useUserNotes() {
	return useMethods(reducer, initialState)
}

export default useUserNotes
