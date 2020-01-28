import {
	Blockquote,
	Break,
	CodeBlock,
	Comment,
	Header,
	Paragraph,
} from "./Components"

import {
	Code,
	Emphasis,
	Strong,
	StrongEmphasis,
} from "./ComponentsText"

const componentTypes = {
	[Header]:         "Header",
	[Comment]:        "Comment",
	[Blockquote]:     "Blockquote",
	[CodeBlock.type]: "CodeBlock",
	[Paragraph]:      "Paragraph",
	[Break]:          "Break",
	[Emphasis]:       "Emphasis",
	[Strong]:         "Strong",
	[StrongEmphasis]: "StrongEmphasis",
	[Code]:           "Code",
}

export default componentTypes
