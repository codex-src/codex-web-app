import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"
import { DocumentTitle } from "utils/DocumentTitle"

const localStorageKey = "codex-app"

const initialValue = localStorage.getItem(localStorageKey) || `# Hello, Codex! 🖖

// 🚧 What you are seeing is the alpha of the _Codex editor_ 🚧
//
// **The following are not yet ready:**
//
// - Images
// - Embeds
// - Syntax highlighting for code blocks
// - Links
// - Lists (like unordered lists, ordered lists, and checklists)

_What is this?_ This is a WYSIWYG editor I’m building for the web, based on markdown and designed for programmers. **This document is editable.**

This editor is designed to be **simple**, **beautiful**, and work for the **modern web**, even on mobile devices.

If you’re curious, the editor is open source: ❤️ https://github.com/codex-src/codex-app

## Shortcuts

There are four shortcuts you should try before reading on:

- \`shift + command + 1\`: Toggle the rich text stylesheet (default)
- \`shift + command + 2\`: Toggle the monospace stylesheet
- \`command + \\\`: Toggle a faint background on markdown text (like _italics_, *bold*, etc.)
- \`command + /\`: Read-only mode -- preview your note _without_ markdown

**If you’re on Windows or Linux, use \`control\` instead of \`command\`.**

In the near future, you’ll be able to directly edit the stylesheets to your liking.

## CommonMark: Block elements

This editor is based on the CommonMark spec of markdown. If you’re familiar with GitHub Flavored Markdown, CommonMark is *very* similar, essentially a subset of GFM.

You can create the following:

- Headers
- Comments
- Blockquotes
- Code blocks
- Breaks

To do so, use the following syntax:

# H1
## H2
### H3
#### H4
##### H5
###### H6

// Comment 👻

> Blockquote
>
> (Blockquotes can also be multiline)

\`\`\`Code block\`\`\`

\`\`\`
(Code blocks can also be multiline)
\`\`\`

// Even emojis are parsed! You can use 1-3 emojis to make them bigger :

🔥🔥🔥

// You can make a section break using this syntax:
***

// Or this syntax:
---

## CommonMark: Inline elements

CommonMark also supports inline elements like _italics_, **bold**, \`code\`. ~Strikethrough~ is also supported. You can also use the alternate syntax for *italics*, __bold__, and ~~strikethrough~~. 👌

## Cut, copy, and paste _as_ markdown

**So long as you’re not in read-only mode,** when you copy a selection of your document, it copies _as markdown_ so you’ll never loose formatting again.

## localStorage

This alpha periodically saves to localStorage (once per second). That means you should be able to refresh and your document will persist.

---

More features coming soon…stay tuned! 📺⚡️`

function EditorApp(props) {
	const [state, dispatch] = Editor.useEditor(initialValue)

	React.useEffect(
		React.useCallback(() => {
			localStorage.setItem(localStorageKey, state.data)
		}, [state]),
		[state.historyIndex],
	)

	return (
		<DocumentTitle title="opencodex.dev">
			<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
				{/* Based on 2388 x 1668 */}
				<div style={stylex.parse("w:834 no-min-w")}>
					<Editor.Editor
						state={state}
						dispatch={dispatch}
					/>
				</div>
			</div>
		</DocumentTitle>
	)
}

export default EditorApp
