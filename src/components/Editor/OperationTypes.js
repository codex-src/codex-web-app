import Enum from "lib/Enum"

const OperationTypes = new Enum(
	"INIT",
	"SELECT",
	"FOCUS",
	"BLUR",
	"INPUT",
	"TAB",
	"ENTER",
	"BACKSPACE",
	"BACKSPACEWORD",
	"BACKSPACELINE",
	"DELETE",
	"DELETEWORD",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

export default OperationTypes
