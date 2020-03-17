import useMethods from "use-methods"

// TDOO: Refactor to useState
const initialState = {
	sortAscending: false,
}

const reducer = state => ({
	toggleSortDirection() {
		state.sortAscending = !state.sortAscending
	},
})

function useUserNotes() {
	return useMethods(reducer, initialState)
}

export default useUserNotes
