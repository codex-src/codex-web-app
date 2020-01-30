import Editor from "components/Editor"
import React from "react"
import stylex from "stylex"

// const LOCALSTORAGE_KEY = "codex-html-app-0-1-0"
//
// const initialValue = `# Hello, Codex!
//
// // The following is preamble, scroll down to see what this editor can do!
//
// **What is this?** This is the *new* editor architecture I’ve been working on for a to be note-taking and publishing app for devs. Think [Medium](https://medium.com) meets [dev.to](https://dev.to). ❤️
//
// *Who’s this for?* This editor is designed for devs and aspiring devs to make it easier to use the Internet as a form of self-expression. It’s my opinion that it should be 100x easier for people to learn how to code, and for developers to teach one another. So this editor is and will be for you!
//
// *How is this different from what you’ve shared before?* If you’re familiar with my work, I’ve spent **months** researching and developing several major prototypes of what I thought could be a stable, fast, cross-browser editor and writing experience. I was wrong. While I was able to produce a stable and fast editor for Chrome, I couldn’t reproduce the editor to the same effect for every major browser.
//
// As it turns out, it’s damn near hard if not impossible to get all of these constraints (stable, fast, cross-browser) under control. So *very* recently, I decided to experiment with a new architecture altogether, one **not** based on contenteditable. Believe you me, this is a glorified textarea. And glorius it is! 🏆
//
// There are **a ton** of benefits we get for free when working with textarea as an input layer; support for all left-to-right alphabets like: 🇨🇳 中文, 🇯🇵 日本語, 🇰🇷 한국어, 🇺🇦 Українська, 🇵🇹 Português, etc., native performance and undo-handling, etc. The caveat to working with a textarea is that text must be \`monospace\` in read-write mode.
//
// ---
//
// **This is editable** -- this editor parses [CommonMark](https://commonmark.org/help)-flavored markdown and more, give it a try!
//
// You can use:
//
// ## 💪 Headers
//
// # EXTRA! EXTRA!
// ## READ ALL ABOUT IT! 🗞
// ### How to build a beautiful blog
// #### Learn this one weird trick 🙊 to debug CSS
// ##### Level up with Bulma CSS
// ###### Let’s learn VueJS
//
// ## 👻 Single line and multiline comments
//
// // TODO: foo bar
// /*
// 	FIXME: baz
// */
//
// ## 🖋 Multiline blockquotes
//
// > *Yoda: No! No different! Only different in your mind. You must _unlearn_ what you have learned.*
// >
// > _Luke: All right, I'll give it a try._
// >
// > *Yoda: No! Try not. Do. Or do not. There is no try.*
//
// ## 🤖 Syntax highlighted code blocks
//
// \`\`\`go
// package main
//
// import "fmt"
//
// func main() {
// 	fmt.Println("hello, world!")
// }
// \`\`\`
//
// \`\`\`sql
// INSERT INTO notes (
// 	user_id,
// 	title_utf8_count,
// 	title,
// 	data_utf8_count,
// 	data )
// VALUES ( $1, $2, $3, $4, $5 )
// RETURNING note_id
// \`\`\`
//
// \`\`\`diff
// - Peace is a lie, there is only passion.
// - Through passion, I gain strength.
// - Through strength, I gain power.
// - Through power, I gain victory.
// - Through victory, my chains are broken.
// - The Force shall free me.
// + There is no emotion, there is peace.
// + There is no ignorance, there is knowledge.
// + There is no passion, there is serenity.
// + There is no chaos, there is harmony.
// + There is no death, there is the Force.
// \`\`\`
//
// All of the following programming languages support syntax highlighting:
//
// - Bash        → \`bash\`
// - C           → \`c\`
// - C++         → \`cpp\`
// - CSS         → \`css\`
// - D           → \`d\`
// - diff        → \`diff\`
// - Docker      → \`docker\`, \`dockerfile\`
// - git         → \`git\`
// - Go          → \`go\`
// - GraphQL     → \`gql\`, \`graphql\`
// - HTML        → \`htm\`, \`html\`
// - HTTP        → \`http\`
// - JavaScript  → \`js\`
// - JSON        → \`json\`
// - Kotlin      → \`kotlin\`
// - PHP         → \`php\`
// - Python      → \`py\`
// - Ruby        → \`rb\`, \`ruby\`
// - Rust        → \`rust\`
// - Sass        → \`sass\`
// - Shell       → \`shell\`
// - SQL         → \`sql\`
// - SVG         → \`svg\`
// - Swift       → \`swift\`
// - TypeScript  → \`ts\`
// - WebAssembly → \`wasm\`
// - XML         → \`xml\`
// - YAML        → \`yml\`, \`yaml\`
//
// ## 📝 Unordered, ordered lists, and checklists
//
// - foo
// 	- bar
// 		- baz
// 		-	qux
// 	-	quux
// - corge
//
// 1. foo
// 	1. bar
// 		1. baz
// 		2. qux
// 	2. quux
// 2. corge
//
// - [ ] foo
// 	- [ ] bar
// 		- [ ] baz
// 		- [x] qux
// 	- [x] quux
// - [x] corge
//
// # 📏 Section breaks
//
// ---
// ***`
//
// const url = new URL(window.location.href) // Parse a new URL
// const key = url.searchParams.get("key")   // Get the URL key
//
// const noteKey = LOCALSTORAGE_KEY + (!key ? "" : `?key=${key}`)
//
// const data = localStorage.getItem(noteKey) || initialValue

function EditorApp(props) {
	// const [state, dispatch] = Editor.useEditor(data)
	const [state, dispatch] = Editor.useEditor(`foo

bar

baz

qux

quux

coorge`)

	// React.useEffect(() => {
	// 	localStorage.setItem(noteKey, state.data)
	// }, [state.data])

	return (
		<div style={stylex.parse("p-x:24 p-y:128 flex -r -x:center")}>
			<div style={stylex.parse("w:834 no-min-w")}>
				<Editor.Editor
					state={state}
					dispatch={dispatch}
					// scrollPastEnd
					// statusBar
					debugger
				/>
			</div>
		</div>
	)
}

export default EditorApp
