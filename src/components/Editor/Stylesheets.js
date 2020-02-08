import Context from "./Context"
import React from "react"

const TextBackgroundStylesheet = props => (
	<style>{
		`
.prefers-text-background .em,
.prefers-text-background .strong {
	padding: 2px;
	background: hsla(var(--blue-a400), 0.05);
}
.prefers-text-background .strikethrough,
.prefers-text-background .comment .em,
.prefers-text-background .comment .strong,
.prefers-text-background .comment .strikethrough {
	padding: 2px;
	background: hsla(var(--gray), 0.1);
}
.prefers-text-background .em *,
.prefers-text-background .strong *,
.prefers-text-background .strikethrough * {
	background: none !important;
}

`.trim()
	}</style>
)

const ReadOnlyModeStylesheet = props => (
	<style>{
		`
.prefers-read-only-mode .blockquote {
	padding-left: var(--padding-x);
	font-size: 1.05em;
	line-height: 1.75;
	box-shadow: inset 2px 0px hsl(var(--blue-a400));
}
.prefers-read-only-mode .blockquote > [data-empty-node] {
	height: 0.75em;
}

.prefers-read-only-mode .code-block > [data-start-node],
.prefers-read-only-mode .code-block > [data-end-node] {
	display: none;
}

.prefers-read-only-mode .break {
	margin: calc(0.75em - 1px) 0px;
	border: 2px solid hsl(var(--gray-200));
}

.prefers-read-only-mode .markdown {
	display: none;
}

`.trim()
	}</style>
)

const SharedStylesheet = props => (
	<style>{
		`
.editor {
	--padding-x:     24px;
	--padding-y:     12px;
	--border-radius: 1px;
	--box-shadow:    0px 0px 0px 1px hsl(var(--gray-300));

	color: hsl(var(--gray-900));
	caret-color: hsl(var(--black));
}
.editor *::selection {
	background: hsla(218, 100%, 58.0392%, 0.25) !important;
}

.header {
	font-weight: bold;
	color: hsl(var(--black));
}

.header.h5 > .markdown,
.header.h6 > .markdown {
	color: hsl(var(--gray));
}

.comment {
	--blue-a400: var(--gray);
	color: hsl(var(--gray));
}

.blockquote {
	color: hsl(var(--blue-a200));
}

.code-block {
	margin: 0px calc(-1 * var(--padding-x));
	padding: var(--padding-y) var(--padding-x);
	background: hsl(var(--gray-50));
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);
	-webkit-overflow-scrolling: touch;
	overflow-x: scroll;
}
.code-block > [data-node] > span {
	padding-right: var(--padding-x);
}

.paragraph.emojis {
	font-size: 1.5em;
}

.emoji {
	font-size: 1.2em;
	line-height: 1;
	vertical-align: -0.1em;
}

.em {
	font-style: italic;
}

.strong {
	font-weight: 600;
}

.code {
	box-decoration-break: clone;
	padding: 1px 2px;
	color: hsl(var(--blue-a400));
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);
}
.code > .markdown {
	color: hsl(var(--gray));
}

.strikethrough {
	--blue-a400: var(--gray);
	font-style: italic;
	color: hsl(var(--gray));
	text-decoration: line-through;
}

.markdown {
	color: hsl(var(--blue-a400));
}

`.trim()
	}</style>
)

const TextStylesheet = props => (
	<style>{
		`
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Mono/Webfonts/index.css";

.editor {
	-moz-tab-size: 4;
	tab-size: 4;
	font: 19px/1.65 system-ui;
}

.code-block ,
.code {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: 16px/1.4 "iA Writer Mono", monospace;
}

.header {
	line-height: 1.4;
}
.header.h1 {
	font-size: 1.50em;
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

.paragraph.emojis {
	font-size: 1.5em;
}

`.trim()
	}</style>
)

const CodeStylesheet = props => (
	<style>{
		`
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Mono/Webfonts/index.css";
@import "https://cdn.jsdelivr.net/gh/codex-src/iA-Fonts@master/iA%20Writer%20Duo/Webfonts/index.css";

.editor {
	-webkit-font-smoothing:  auto;
	-moz-osx-font-smoothing: auto;

	-moz-tab-size: 2;
	tab-size: 2;
	font: 16px/1.65 "iA Writer Duo", monospace;
}

.code-block,
.code {
	font: 16px/1.4 "iA Writer Mono";
}

`.trim()
	}</style>
)

function Stylesheets(props) {
	const [state] = React.useContext(Context)
	return (
		<React.Fragment>
			<TextBackgroundStylesheet />
			<ReadOnlyModeStylesheet />
			<SharedStylesheet />
			{state.prefersReadOnlyMode || !state.prefersCodeStylesheet ? (
				<TextStylesheet />
			) : (
				<CodeStylesheet />
			)}
		</React.Fragment>
	)
}

export default Stylesheets
