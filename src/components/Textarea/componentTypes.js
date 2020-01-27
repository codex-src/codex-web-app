import {
	Blockquote,
	Break,
	CodeBlock,
	Comment,
	Header,
	Paragraph,
} from "./Components"

const componentTypes = {
	[Header]:         "Header",
	[Comment]:        "Comment",
	[Blockquote]:     "Blockquote",
	[CodeBlock.type]: "CodeBlock",
	[Paragraph]:      "Paragraph",
	[Break]:          "Break",
}

export default componentTypes
