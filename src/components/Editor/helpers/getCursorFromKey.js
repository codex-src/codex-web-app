// Creates a new cursor.
export function newCursor() {
	const cursor = {
		key: "",
		index: 0,
		offset: 0,
		pos: 0,
	}
	return cursor
}

// Gets a cursor for a key. Accepts a cursor as a shortcut.
export function getCursorFromKey(nodes, fromKey, cursor, dir = 1) {
	if (!cursor) {
		cursor = newCursor()
	}
	while (cursor.index >= 0 && cursor.index < nodes.length) {
		const { key, data } = nodes[cursor.index]
		if (key === fromKey) {
			cursor.key = key
			break
		}
		cursor.pos += dir * `\n${data}`.length
		cursor.index += dir
	}
	return cursor
}
