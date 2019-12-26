import * as Editor from "./Editor"
import TestEditor from "./TestEditor"
import useEditor from "./EditorReducer"

const exports = {
	Editor: Editor.Editor, // TestEditor
	useEditor,
}

export default exports
