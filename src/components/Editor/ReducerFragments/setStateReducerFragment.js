import OperationTypes from "../OperationTypes"

export function setStateReducerFragment(state) {
	const dispatchers = {
		setState(body, pos1, pos2) {
			if (pos1.pos > pos2.pos) {
				;[pos1, pos2] = [pos2, pos1]
			}
			Object.assign(state, { body, pos1, pos2 })
		},
		recordOp(op) {
			if (op === OperationTypes.SELECT && Date.now() - state.opRecordedAt < 100) {
				// No-op.
				return
			}
			const opRecordedAt = Date.now()
			Object.assign(state, { op, opRecordedAt })
		},
		collapse() {
			state.pos2 = state.pos1
		},
		// `write` writes at the current cursor positions.
		write(data) {
			if (!state.historyIndex && !state.didWritePos) {
				state.history[0].pos1.pos = state.pos1.pos
				state.history[0].pos2.pos = state.pos2.pos
				state.didWritePos = true
			}
			this.dropRedoStates()
			state.body = state.body.write(data, state.pos1.pos, state.pos2.pos)
			state.pos1.pos += data.length
			this.collapse()
			this.render()
		},
		// `greedyWrite` greedily writes to the cursor positions
		// then resets the VDOM cursors.
		greedyWrite(data, pos1, pos2, resetPos) {
			if (!state.historyIndex && !state.didWritePos) {
				state.history[0].pos1.pos = state.pos1.pos
				state.history[0].pos2.pos = state.pos2.pos
				state.didWritePos = true
			}
			this.dropRedoStates()
			state.body = state.body.write(data, pos1, pos2)
			state.pos1 = resetPos
			this.collapse()
			this.render()
		},
		// `dropBytes` drops bytes from the left and or right of
		// the current cursor positions.
		dropBytes(dropL, dropR) {
			// Guard the start node and or end node:
			if ((!state.pos1.pos && dropL) || (state.pos2.pos === state.body.data.length && dropR)) {
				// No-op.
				return
			}
			this.dropRedoStates()
			state.body = state.body.write("", state.pos1.pos - dropL, state.pos2.pos + dropR)
			state.pos1.pos -= dropL
			this.collapse()
			this.render()
		},
	}
	return dispatchers
}
