import AppContainer from "components/AppContainer"
import E from "lib/Emoji"
import React from "react"

/* eslint-disable jsx-a11y/accessible-emoji */

// Renders a question block -- children[0] is the question
// and children[1] is an <Answer>.
const QuestionBlock = ({ children }) => (
	<div>
		<h3 className="font-medium text-lg Poppins">
			{children[0]}
		</h3>
		<div className="h-2" />
		{children[1]}
	</div>
)

// Renders an answer.
const Answer = ({ children }) => (
	<div className="text-gray-900">
		{children}
	</div>
)

const Code = ({ children }) => (
	<code className="px-1 py-px font-mono text-sm text-md-blue-a400 border rounded">{children}</code>
)
const Anchor = ({ href, children }) => (
	<a className="font-medium text-gray-900" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
)

const Checkmark = () => (
	// <input className="form-checkbox mr-3 text-green-400 rounded-full transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />

	// https://refactoringui.com/book
	<svg className="mr-3 inline-block h-5 w-5" viewBox="0 0 20 20">
		<g fill="none" fillRule="evenodd">
			<circle className="text-green-100" cx="10" cy="10" r="10" fill="currentColor" />
			<polyline className="text-green-400" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="6 10 8.667 12.667 14 7.333" />
		</g>
	</svg>
)

const FAQ = () => (
	<div className="py-24 border-t-4 border-gray-100">
		<AppContainer>

			{/* Questions */}
			<h2 className="font-medium text-3xl md:text-4xl Poppins Poppins-clip-path-bottom">
				Frequently asked questions
			</h2>

			{/* Answers */}
			<div className="h-6" />
			<div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "2.25rem" /* gap-9 */ }}>

				{/* LHS */}
				<div>

					<QuestionBlock>
						What is Codex?
						<Answer>
							Codex is a new WYSIWYG, what-you-see-is-what-you-get, markdown editor and notebook for the developer community.&nbsp;<E>👍</E><br />
							<br />
							<strong>Codex enables you to be more productive by helping you focus on what matters.</strong>
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Why is it called /ˈkōˌdeks/?
						<Answer>
							The name ‘Codex’ is actually inspired by <Anchor href="https://en.wikipedia.org/wiki/Codex_Leicester">Leonardo da Vinci’s Codex Leicester</Anchor>. I actually found out when writing this that <Anchor href="https://businessinsider.com/look-inside-the-codex-leicester-which-bill-gates-bought-for-30-million-2015-7">Bill Gates bought Leonardo da Vinci’s Codex for $30 million</Anchor>.&nbsp;<E>🤯</E><br />
							<br />
							I got really inspired by this idea of ‘what would a modern, technical journal look like?’ and ‘why don’t we have one?’ This led me to building Codex.
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Is Codex based on GitHub Flavored Markdown?
						<Answer>
							Yes! The Codex parser is based on <Anchor href="https://guides.github.com/features/mastering-markdown">GitHub Flavored Markdown</Anchor>.<br />
							<br />
							So far, Codex supports:<br />
							<br />
							<ul>
								<li className="my-px">
									<Checkmark />
									Headers
								</li>
								<li className="my-px">
									<Checkmark />
									Blockquotes
								</li>
								<li className="my-px">
									<Checkmark />
									Unordered lists
								</li>
								<li className="my-px">
									<Checkmark />
									Ordered lists
								</li>
								<li className="my-px">
									<Checkmark />
									Task items (also known as checklists)
								</li>
								<li className="my-px">
									<Checkmark />
									Code blocks (includes syntax highlighting)
								</li>
								<li className="my-px">
									<Checkmark />
									Images
								</li>
								<li className="my-px">
									<Checkmark />
									Section breaks
								</li>
								<li className="my-px">
									<Checkmark />
									<em>Italics</em>
								</li>
								<li className="my-px">
									<Checkmark />
									<strong>Bold</strong>
								</li>
								<li className="my-px">
									<Checkmark />
									<Code>code</Code>
								</li>
								<li className="my-px">
									<Checkmark />
									<button className="text-blue-500 hover:underline">Links</button> and naked links: <button className="text-blue-500 hover:underline">https://codexapp.dev</button>
								</li>
								<li className="my-px">
									<Checkmark />
									<strike className="text-gray-500">Strikethrough</strike>
								</li>
							</ul>
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Does Codex support embeds and tables?
						<Answer>
							Not just yet, but these are planned features.
						</Answer>
					</QuestionBlock>

				</div>

				{/* RHS */}
				<div>

					<div className="h-6" />
					<QuestionBlock>
						How does the Codex editor actually work?
						<Answer>
							You might be surprised to learn that the Codex editor (and pretty much all the technology Codex uses) is <Anchor href="https://github.com/codex-src">MIT-licensed open source</Anchor>. It’s important to me that everything I’ve learned <em>be learnable</em>.<br />
							<br />
							Essentially, I use React and <Code>contenteditable</Code> to seed control of user-editing to a virtual document representation (VDOM). <Code>keydown</Code> and <Code>input</Code> events, among other events, manipulate the VDOM. Finally, React rerenders the virtual document back to the DOM.<br />
							<br />
							Of course, the implementation is far more subtle and treacherous.&nbsp;<E>👻</E>.<br />
							<br />
							(No — I’m not using a popular open source library like <Anchor href="https://github.com/facebook/draft-js">Draft.js</Anchor> or <Anchor href="https://github.com/codemirror/CodeMirror">CodeMirror</Anchor> to engineer the Codex editor.)
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Can I use Codex for my personal blog?
						<Answer>
							Not just yet, but this is a planned feature I’m excited to build. I myself want to use Codex to host my personal blog. Don’t you?
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Why should I pay for Codex?
						<Answer>
							You don’t have to. The free tier offers unlimited notes, each limited to 2,500 words. For reference, 2,500 words is <em>a lot</em> — far longer than the average blog post.<br />
							<br />
							However, when you pay for Codex, you get a lot more:<br />
							<br />
							<ul>
								<li className="my-px">
									<Checkmark />
									<E>📚</E> Unlimited notes (included in the free tier)
								</li>
								<li className="my-px">
									<Checkmark />
									<E>📖</E> Unlimited note-length
								</li>
								<li className="my-px">
									<Checkmark />
									<E>🕶</E> Dark mode
								</li>
								<li className="my-px">
									<Checkmark />
									<E>👾</E> Monospace-mode
								</li>
								<li className="my-px">
									<Checkmark />
									<E>👨🏻‍🎨</E> Custom color theming and font-styling
								</li>
								<li className="my-px">
									<Checkmark />
									<E>🚀</E> Export notes to HTML
								</li>
							</ul>
						</Answer>

					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Do you offer refunds?
						<Answer>
							Yes. If you’re not satisfied with Codex, email me at <Anchor href="mailto:support@codexapp.dev">support@codexapp.dev</Anchor> within 30 days of your original purchase and I’ll refund you in full, no questions asked.
						</Answer>
					</QuestionBlock>

				</div>
			</div>

		</AppContainer>
	</div>
)

export default FAQ
