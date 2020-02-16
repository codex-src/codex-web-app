# Hello, world!

### 🚧 This is the _alpha_ of the Codex editor; images, syntax highlighting, links and lists are not yet supported but will be soon! 🚧

> _What is this?_

**Codex makes it easier than ever to express yourself in words and code.** The editor is based on CommonMark and works _everywhere_. **Psst…this document is editable!**

## Shortcuts

There are currently four shortcuts:

- `shift-command-1`: Toggle the proportional type stylesheet (default)
- `shift-command-2`: Toggle the monospace stylesheet
- `command-\`: Toggle background on inline elements (like _italics_, **bold**, etc.)
- `command-/`: Toggle preview mode

> **Note:** If you’re on Windows or Linux, use `control` instead of `command`.

## Block elements

This editor is based on CommonMark markdown. If you’re familiar with GitHub Flavored Markdown, CommonMark is *very* similar.

You can create all of the following:

- Headers
- Blockquotes
- Code blocks
- Section breaks

For example:

# Header
## Subheader
### How to Build a Beautiful Blog
#### Learn This One Weird Trick to Debug CSS
##### Level Up with Bulma CSS
###### Let’s Learn Vue.js

> **Yoda: No! No different! Only different in your mind. You must _unlearn_ what you have learned.**
>
> _Luke: All right, I'll give it a try._
>
> **Yoda: No! Try not. Do. Or do not. There is no try.**

```main.go
package main

import "fmt"

func main() {
	fmt.Println("hello, codex!")
}
```

**Even emojis are parsed!** 😲

🔥🔥🔥

---

> **Note:** You can also use `***` for section breaks.

## Inline elements

CommonMark also supports inline elements like _italics_, **bold**, `code`, and ~strikethrough~. You can also use the alternate syntax for *italics*, __bold__, and ~~strikethrough~~. 👌

## Cut, copy, and paste _as_ markdown

So long as you’re not in preview mode, when you copy a selection, the selection copies _as_ markdown; this means you’ll _never_ loose formatting again!

However, if you want to copy _without_ markdown syntax, toggle preview mode (`command-/` on macOS or `control-/` on Windows and Linux) and copy a selection.

## localStorage

This note is automatically backed up to localStorage after every write — you should be able to refresh the page and your note will persist. ✨
