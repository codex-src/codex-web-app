import useMethods from "use-methods"

import {
	ITEMS_SHOWN_DEFAULT,
	ITEMS_SHOWN_MAX,
	ITEMS_SHOWN_MIN,
} from "./constants"

const initialState = {
	itemsShown: ITEMS_SHOWN_DEFAULT,
	sortAscending: false,
	scrollEnabled: false,
}

const reducer = state => ({
	showLessItems() {
		if (state.itemsShown === ITEMS_SHOWN_MIN) {
			// No-op
			return
		}
		state.itemsShown--
	},
	showMoreItems() {
		if (state.itemsShown === ITEMS_SHOWN_MAX) {
			// No-op
			return
		}
		state.itemsShown++
	},
	toggleSortDirection() {
		state.sortAscending = !state.sortAscending
	},
	toggleScrollEnabled() {
		state.scrollEnabled = !state.scrollEnabled
	},
})

function useUserNotes() {
	return useMethods(reducer, initialState)
}

export default useUserNotes
