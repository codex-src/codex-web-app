import Enum from "utils/Enum"

const ActionTypes = new Enum(
	"INIT",
	"FOCUS",
	"BLUR",
	"SELECT",
	"CHANGE",
	"INSERT",
	"CUT",
	"COPY",
	"PASTE",
	"UNDO",
	"REDO",
)

export default ActionTypes
