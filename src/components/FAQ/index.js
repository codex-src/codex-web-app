import * as Meta from "components/Meta"
import AppContainer from "components/AppContainer"
import E from "lib/Emoji"
import React from "react"
import trimSpaces from "lib/trimSpaces"

/* eslint-disable jsx-a11y/accessible-emoji */

const QuestionBlock = ({ className, children }) => (
	<div className={className}>
		{React.cloneElement(children[0], {
			className: trimSpaces(`${children[0].props.className}
				font-medium text-lg Poppins`),
		})}
		<div className="mt-2">
			{children.slice(1)}
		</div>
	</div>
)

const Code = ({ children }) => (
	// NOTE: Use inline-block because of <code>
	<code className="px-1 inline-block font-mono text-sm text-md-blue-a400 border rounded">{children}</code>
)

const Anchor = ({ href, children }) => (
	<a className="font-medium text-gray-900" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
)

// https://refactoringui.com/book
const Checkmark = () => (
	<svg className="mr-3 inline-block h-5 w-5" viewBox="0 0 20 20">
		<g fill="none" fillRule="evenodd">
			<circle className="text-green-100" cx="10" cy="10" r="10" fill="currentColor" />
			<polyline className="text-green-400" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="6 10 8.667 12.667 14 7.333" />
		</g>
	</svg>
)

const FAQContentsFragment = () => (
	<React.Fragment>

		<Meta.HeaderBlock>
			<h2>
				<span className="inline-block Poppins-clip-path-bottom">Frequently</span>{" "}
				<span className="inline-block Poppins-clip-path-bottom">asked</span>{" "}
				<span className="inline-block Poppins-clip-path-bottom">questions</span>{" "}
				<E>🤔</E>
			</h2>
		</Meta.HeaderBlock>

		{/* <h2 className="font-medium text-3xl md:text-4xl Poppins Poppins-clip-path-bottom"> */}
		{/* Frequently asked questions */}
		{/* </h2> */}

		<div className="mt-8 grid grid-cols-1 md:grid-cols-2 md:gap-8">

			{/* LHS */}
			<div>

				<QuestionBlock>
					<h3>
						What is Codex?
					</h3>
					<p>
						Codex is a new WYSIWYG, what-you-see-is-what-you-get, markdown editor and notebook for the developer community. <E>👍</E>
					</p>
					<p className="mt-4">
						Codex enables you to be more productive by helping you focus on what matters — expressing yourself in words and <Code>code</Code>.
					</p>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Why is it called \co·dex\?
					</h3>
					<p>
						The name ‘Codex’ is actually inspired by <Anchor href="https://en.wikipedia.org/wiki/Codex_Leicester">Leonardo da Vinci’s Codex Leicester</Anchor>.{" "}
						I actually found out when writing this that <Anchor href="https://businessinsider.com/look-inside-the-codex-leicester-which-bill-gates-bought-for-30-million-2015-7">Bill Gates bought Leonardo da Vinci’s Codex for $30 million</Anchor>. <E>🤯</E>
					</p>
					<p className="mt-4">
						I got really inspired by this idea of ‘what would a modern, technical journal look like?’ and ‘why don’t we have one?’{" "}
						This led me to building Codex.
					</p>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Is Codex based on GitHub Flavored Markdown?
					</h3>
					<p>
						Yes!{" "}
						The Codex parser is based on <Anchor href="https://guides.github.com/features/mastering-markdown">GitHub Flavored Markdown</Anchor>.
					</p>
					<p className="mt-4">
						So far, Codex supports:
					</p>
					<ul className="mt-4">
						<li className="my-1">
							<Checkmark />
							Headers <Code>#&nbsp;</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Blockquotes <Code>>&nbsp;</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Unordered lists <Code>-&nbsp;</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Ordered lists  <Code>1.&nbsp;</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Checklists <Code>- [ ]&nbsp;</Code> or <Code>- [x]&nbsp;</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Code blocks <Code>```</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Images <Code>![]()</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							Breaks <Code>---</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<em>Italics</em> <Code>*</Code> or <Code>_</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<strong>Bold</strong> <Code>**</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<Code>code</Code> <Code>`</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<Anchor>Links</Anchor> <Code>[]()</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<Anchor>https://codexapp.dev</Anchor> <Code>https://</Code> or <Code>http://</Code>
						</li>
						<li className="my-1">
							<Checkmark />
							<strike className="text-gray-500">Strikethrough</strike> <Code>~~</Code>
						</li>
					</ul>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Does Codex support embeds and tables?
					</h3>
					<p>
						Not just yet, but these are planned features. <E>👍</E>
					</p>
				</QuestionBlock>

			</div>

			{/* RHS */}
			<div>

				<QuestionBlock>
					<h3>
						How does the Codex editor actually work?
					</h3>
					<p>
						You might be surprised to learn that the Codex editor (and pretty much all the technology Codex uses) is <Anchor href="https://github.com/codex-src">MIT-licensed open source</Anchor>.{" "}
						It’s important to me that everything I’ve learned <em>be learnable</em>.
					</p>
					<p className="mt-4">
						Essentially, I use React and <Code>contenteditable</Code> to seed control of user-editing to a virtual document representation (VDOM).{" "}
						<Code>keydown</Code> and <Code>input</Code> events, among other events, manipulate the VDOM.{" "}
						Finally, React rerenders the virtual document back to the DOM.
					</p>
					<p className="mt-4">
						Of course, the implementation is far more subtle and treacherous. <E>👻</E>.
					</p>
					<p className="mt-4">
						(No — I’m not using a popular open source library like <Anchor href="https://github.com/facebook/draft-js">Draft.js</Anchor> or <Anchor href="https://github.com/codemirror/CodeMirror">CodeMirror</Anchor> to engineer the Codex editor.)
					</p>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Can I use Codex for my personal blog?
					</h3>
					<p>
						Not just yet, but this is a planned feature I’m excited to build.{" "}
						I myself want to use Codex to host my personal blog.{" "}
						Don’t you?
					</p>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Why should I pay for Codex?
					</h3>
					<p>
						You don’t have to.{" "}
						The free tier offers unlimited notes, each limited to 2,500 words.{" "}
						For reference, 2,500 words is <em>a lot</em> — far longer than the average blog post.
					</p>
					<p className="mt-4">
						However, when you pay for Codex, you get a lot more:
					</p>
					<ul className="mt-4">
						<li className="my-1">
							<Checkmark />
							<E>📚</E> Unlimited notes (included in the free tier)
						</li>
						<li className="my-1">
							<Checkmark />
							<E>📖</E> Unlimited note-length
						</li>
						{/* <li className="my-1"> */}
						{/* 	<Checkmark /> */}
						{/* 	<E>🕶</E> Dark mode */}
						{/* </li> */}
						<li className="my-1">
							<Checkmark />
							<E>👾</E> Monospace-mode
						</li>
						<li className="my-1">
							<Checkmark />
							<E>👨🏻‍🎨</E> Custom color theming and font-styling
						</li>
						<li className="my-1">
							<Checkmark />
							<E>🔗</E> Share notes with a link
						</li>
						<li className="my-1">
							<Checkmark />
							<E>🚀</E> Export notes to HTML
						</li>
					</ul>
				</QuestionBlock>

				<QuestionBlock className="mt-6">
					<h3>
						Do you offer refunds?
					</h3>
					<p>
						If you’re not satisfied with Codex, email me at <Anchor href="mailto:support@codexapp.dev">support@codexapp.dev</Anchor> within 30 days of your original purchase and I’ll refund you in full, no questions asked.
					</p>
				</QuestionBlock>

			</div>
		</div>

	</React.Fragment>
)

const FAQ = () => (
	<div className="py-12 sm:py-24 border-t-4 border-gray-100">
		<AppContainer>
			<FAQContentsFragment />
		</AppContainer>
	</div>
)

export default FAQ
