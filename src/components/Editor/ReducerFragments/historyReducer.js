export function historyReducer(state) {
	const dispatchers = {
		// `storeUndoState` stores the current state to the
		// history stack and increments the history stack index.
		storeUndoState() {
			const undoState = state.history[state.historyIndex]
			if (undoState.body.data.length === state.body.data.length && undoState.body.data === state.body.data) {
				// No-op.
				return
			}
			const { body, pos1, pos2 } = state
			state.history.push({ body, pos1: pos1.newReference(), pos2: pos2.newReference() })
			state.historyIndex++
		},
		// `dropRedoStates` drops future states (redo states)
		// from the history stack.
		dropRedoStates() {
			state.history.splice(state.historyIndex + 1)
		},
	}
	return dispatchers
}
