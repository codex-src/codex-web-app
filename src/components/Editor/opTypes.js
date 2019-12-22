// `opTypes` documents the editor’s operation types.
//
// https://github.com/facebook/draft-js/blob/585af35c3a8c31fefb64bc884d4001faa96544d3/src/component/handlers/DraftEditorModes.js
const opTypes = {
	focus:   "focus",
	blur:    "blur",
	select:  "select",
	write:   "write",
	compose: "compose", // https://www.w3.org/TR/ime-api.
	delete:  "delete",
	cut:     "cut",
	copy:    "copy",
	paste:   "paste",
	undo:    "undo",
	redo:    "redo",
}

export default opTypes
