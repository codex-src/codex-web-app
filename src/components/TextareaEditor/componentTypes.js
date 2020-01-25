import {
	Blockquote,
	Break,
	CodeBlock,
	Comment,
	Header,
	Paragraph,
} from "./Components"

const componentTypes = {
	[Header.type]:     "Header",
	[Comment.type]:    "Comment",
	[Blockquote.type]: "Blockquote",
	[CodeBlock.type]:  "CodeBlock",
	[Paragraph.type]:  "Paragraph",
	[Break.type]:      "Break",
}

export default componentTypes
