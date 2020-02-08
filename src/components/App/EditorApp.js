import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"
import { DocumentTitle } from "utils/DocumentTitle"

const localStorageKey = "codex-app"
const initialValue = localStorage.getItem(localStorageKey) || `# Hello, Codex! 🖖

// Links are coming, just not yet. 😉

_What is this?_ My name is [Zaydek](https://twitter.com/username_ZAYDEK) and I’m building an editor for the web, purpose-built for programmers and markdown.

> “When you're in love, you want to tell the world.”
>
> — Carl Sagan

The reason _why_ I’m building this editor is because I love programming and I want to share it with the world. That, and because I believe people fundamentally need better tools to express themselves and learn from each other.

The constraints for this editor are simple:

- Make it fast
- Make it beautiful
- Make it work ~almost everywhere~ everywhere

This editor is designed to work in all modern browsers, including mobile devices. That means dedicated support for:

- 🌈 Chrome
- 🧭 Safari
- 🦊 Firefox
- (Includes browsers based on these, which is basically all of them)

If you’re curious about the internals, it’s [open source ❤️](https://github.com/codex-src) and built on top of [React ⚛️](https://github.com/facebook/react).

If you want to get involved -- please, be my guest! You can:

- [Open an issue](https://github.com/codex-src)
- [Create a pull request](https://github.com/codex-src)
- [DM me on Twitter](https://twitter.com/messages/compose?recipient_id=899350210064687105)

## Monospace and proportional type stylesheets

This editor ships with two stylesheets you can opt into -- in the future, you’ll be able edit these stylesheets *in the browser* to your liking. 🤭

**Prefer monospace?** Press \`command shift 2\` (\`control\` on Windows/Linux) to toggle the monospace stylesheet and \`command shift 1\` to toggle the proportional type stylesheet.

Here’s a couple of lines of code from the proportional type stylesheet:

\`\`\`css
.header {
	font-weight: bold;
	color: hsl(var(--black));
}
.header.h1 {
	font-size: 1.5em;
}
.header.h2 {
	font-size: 1.25em;
}
.header.h3 {
	font-size: 1.20em;
}
.header.h4 {
	font-size: 1.15em;
}
.header.h5 {
	font-size: 1.10em;
}
.header.h6 {
	font-size: 1.05em;
}
\`\`\`

## Markdown (CommonMark)

This editor supports the [CommonMark](https://commonmark.org/help) spec of markdown. If you’re familiar with [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown), CommonMark is *very* similar.

The reason why this editor specifically supports CommonMark is because it’s approachable and lends itself well to a hybrid WYSIWYG experience.

You can create the following block elements:

# H1
## H2
### H3
#### H4
##### H5
###### H6

// Comments 👻

> **Yoda: No! No different! Only different in your mind. You must _unlearn_ what you have learned.**
>
> _Luke: All right, I'll give it a try._
>
> **Yoda: No! Try not. Do. Or do not. There is no try.**

\`\`\`$ go run main.go\`\`\`

\`\`\`go
package main

import "fmt"

func main() {
	fmt.Println("hello, world!")
}
\`\`\`

\`\`\`sql
INSERT INTO notes (
	user_id,
	title_utf8_count,
	title,
	data_utf8_count,
	data )
VALUES ( $1, $2, $3, $4, $5 )
RETURNING note_id
\`\`\`

\`\`\`diff
- Peace is a lie, there is only passion.
- Through passion, I gain strength.
- Through strength, I gain power.
- Through power, I gain victory.
- Through victory, my chains are broken.
- The Force shall free me.
+ There is no emotion, there is peace.
+ There is no ignorance, there is knowledge.
+ There is no passion, there is serenity.
+ There is no chaos, there is harmony.
+ There is no death, there is the Force.
\`\`\`

You can use any of the following languages by delimiting the start of a multiline code block with an filename extension or filename:

// Syntax highlighting is coming, just not yet. 😉

\`\`\`<extension> or <filename>
- Bash        → bash
- C           → c
- C++         → cpp
- CSS         → css
- D           → d
- diff        → diff
- Docker      → docker, dockerfile
- git         → git
- Go          → go
- GraphQL     → gql, graphql
- HTML        → htm, html
- HTTP        → http
- JavaScript  → js
- JSON        → json
- Kotlin      → kotlin
- PHP         → php
- Python      → py
- Ruby        → rb, ruby
- Rust        → rust
- Sass        → sass
- Shell       → shell
- SQL         → sql
- SVG         → svg
- Swift       → swift
- TypeScript  → ts
- WebAssembly → wasm
- XML         → xml
- YAML        → yml, yaml
\`\`\`

Even emojis are parsed: text emojis 😯 are 20% bigger and block emojis (1-3) are 50% bigger:

🔥🔥🔥

// Lists are coming, just not yet. 😉

- foo
	- bar
		- baz
		-	qux
	-	quux
- corge

1. foo
	1. bar
		1. baz
		2. qux
	2. quux
2. corge

- [ ] foo
	- [ ] bar
		- [ ] baz
		- [x] qux
	- [x] quux
- [x] corge

// Break (style 1)
***

// Break (style 2)
---

And of course, you can create inline elements like _italics_, **bold**, \`code\`, [links](url), and ~strikethrough~. Or you can use the alternate syntax for *italics*, __bold__. 👌 And you can even use /* inline comments */.

## Markdown hinting (inline elements)

See the blue and gray background behind the inline elements? That’s toggleable with the \`command \\\` (\`control\` on Windows/Linux) shortcut.

## Read-only mode

When you’re ready to read your note as if a user, you can press \`command /\` (\`control\` on Windows/Linux) shortcut to toggle read-only mode (think preview mode).
`

function EditorApp(props) {
	const [state, dispatch] = Editor.useEditor(initialValue)

	React.useEffect(() => {
		localStorage.setItem(localStorageKey, state.data)
	}, [state.data])

	// Lazy implementation:
	const title = state.data.split("\n", 1)[0].replace(/^#{1,6} /, "")
	return (
		<DocumentTitle title={title}>
			<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
				<div style={stylex.parse("w:834 no-min-w")}>
					<Editor.Editor
						state={state}
						dispatch={dispatch}
						// scrollPastEnd
						// statusBar
						// debugger
					/>
				</div>
			</div>
		</DocumentTitle>
	)
}

export default EditorApp
