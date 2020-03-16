import useMethods from "use-methods"

/* eslint-disable no-multi-spaces */
const ITEMS_MODIFIER = 0.75
const ITEMS_DEFAULT  = 3
const ITEMS_MIN      = 2
const ITEMS_MAX      = 4
/* eslint-enable no-multi-spaces */

const initialState = {
	itemsShown: ITEMS_DEFAULT,
	itemsShownModifier: ITEMS_MODIFIER,
	sortAscending: false,
}

const reducer = state => ({
	showLessItems() {
		if (state.itemsShown === ITEMS_MIN) {
			// No-op
			return
		}
		state.itemsShown--
		state.itemsShownModifier = ITEMS_MODIFIER * ITEMS_DEFAULT / state.itemsShown
	},
	showMoreItems() {
		if (state.itemsShown === ITEMS_MAX) {
			// No-op
			return
		}
		state.itemsShown++
		state.itemsShownModifier = ITEMS_MODIFIER * ITEMS_DEFAULT / state.itemsShown
	},
	toggleSortDirection() {
		state.sortAscending = !state.sortAscending
	},
})

function useUserNotes() {
	return useMethods(reducer, initialState)
}

export default useUserNotes
