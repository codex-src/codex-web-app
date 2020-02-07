import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"
import { DocumentTitle } from "utils/DocumentTitle"

const localStorageKey = "codex-app"
const initialValue = localStorage.getItem(localStorageKey) || `# The Codex editor is designed to be different; **it’s a next-generation markdown editor for the web, purpose-built for programmers**

## Backstory

*What is this?* My name is [Zaydek](...) and I’m building a new kind of rich editor for the web. If you know who I am, you’re probably familiar by now that I’ve been struggling to build an editor for quite some time. Well, the hurt may finally be over! 🎉

The constraint for the editor are simple:

- It needs to be fast
- It needs to be beautiful
- It needs to work everywhere

Believe it not, this editor is designed to work in all modern browsers, mobile inclusive. In practice, this means I’m targeting (and testing):

- Chromium/Chrome
- WebKit/Safari
- Gecko/Firefox

If you’re curious about the internals, it’s [open source](...) and builds on [React ⚛️](...).

## Features

### Proportional type and monospace stylesheets

This editor ships with *two* stylesheets you can opt into. There’s proportional type (the default, most likely what you’re seeing now) and monospace.

**Prefer monospace?** Press \`cmd-shift-2\` (\`ctrl\` on Windows/Linux) to toggle the monospace stylesheet, and \`cmd-shift-1\` to toggle the proportional type stylesheet.

In the future, you’ll be able to edit these stylesheets in the browser to your liking!

For now, here’s a test of how the stylesheets work:

\`\`\`css
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Mono/Webfonts/index.css";

.flag-stylesheet-type .header {
	font-weight: bold;
	color: hsl(var(--black));
}
.flag-stylesheet-type .header.h1 {
	font-size: 1.75em;
}
.flag-stylesheet-type .header.h2 {
	font-size: 1.25em;
}
.flag-stylesheet-type .header.h3 {
	font-size: 1.20em;
}
.flag-stylesheet-type .header.h4 {
	font-size: 1.15em;
}
.flag-stylesheet-type .header.h5 {
	font-size: 1.10em;
}
.flag-stylesheet-type .header.h6 {
	font-size: 1.05em;
}
\`\`\`

\`flag-stylesheet-type\` targets the proportional type stylesheet and \`flag-stylesheet-mono\` targets the monospace stylesheet.

### Markdown

This editor supports the [CommonMark](...) specification of markdown. If you’re familiar with [GFM](https://guides.github.com/features/mastering-markdown) (GitHub Flavored Markdown), CommonMark is *very* similar and can be considered a subset of GFM.

The reason this editor specifically supports CommonMark is because it’s simpler and lends itself better to a hybrid WYSIWYG experience.

In addition to headers (\`h1-h6\`), you can create:

// Comments
/*
	Multiline comments
*/

// Paragraphs:
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

// Blockquotes:
> *Yoda: No! No different! Only different in your mind. You must _unlearn_ what you have learned.*
>
> _Luke: All right, I'll give it a try._
>
> *Yoda: No! Try not. Do. Or do not. There is no try.*

// Code blocks:
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

All of these languages are supported via extension (\`go\`) or filename (\`main.go\`):

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

🔥🔥🔥

// Unordered, ordered lists, and checklists:
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

// Section breaks
***
---

And of course, inline elements like *italics*, **bold**, ***bold and italics***, \`code\`, [links](url), and ~strikethrough~. You can also use the alternate syntax for _italics_, __bold__, ___bold and italics___ if you prefer. 👌

### Markdown hinting

See the faint blue background behind the inline elements? That’s toggleable with the \`cmd-;\` (\`ctrl\` on Windows and Linux) shortcut. This feature is disabled in read-only mode.

### Read-only mode

When you’re ready to read your note as if a user, you can press \`cmd-'\` (\`ctrl\` on Windows/Linux) shortcut to toggle read-only mode (think preview mode).

---

More features coming soon…
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
