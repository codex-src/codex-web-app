import AppContainer from "components/AppContainer"
import React from "react"

// Renders a question block -- children[0] is the question
// and children[1] is an <Answer>.
const QuestionBlock = ({ children }) => (
	<div>
		{/* style={{ clipPath: "inset(0 0 18.75% 0)" }} */}
		<h3 className="font-medium Poppins text-xl text-gray-900">
			{children[0]}
		</h3>
		<div className="h-3" />
		{children[1]}
	</div>
)

// Renders an answer.
const Answer = ({ children }) => (
	<p className="text-px tracking-px text-gray-600">
		{children}
	</p>
)

const FAQ = () => (
	<div className="py-12 bg-gray-100 dark:bg-gray-800">
		<AppContainer>

			{/* Title */}
			<h2 className="text-3xl md:text-5xl font-semibold Poppins text-gray-900" style={{ clipPath: "inset(0 0 18.75% 0)" }}>
				Frequent questions
			</h2>

			{/* Questions and answers */}
			<div className="h-12" />
			<div className="grid md:grid-cols-2 gap-8">

				<div className="grid gap-8">
					<QuestionBlock>
						What is Codex?
						<Answer>
							Codex is a new WYSIWYG, what-you-see-is-what-you-get, markdown editor and notebook, based on web technologies.&nbsp;<span ariaLabel="atom symbol" role="img">⚛️</span><br />
							<br />
							{/* FIXME? */}
							<strong className="font-medium">Codex enables you to work more productively by helping you focus on what matters — your writing.</strong>
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Why is it called \cō·dex\?
						<Answer>
							The name ‘Codex’ is primarily inspired by Leonardo da Vinci’s Codex Leicester. His codex was one of many for documenting discoveries. I actually found out when writing this that <a className="text-blue-500" href="https://businessinsider.com/look-inside-the-codex-leicester-which-bill-gates-bought-for-30-million-2015-7" target="_blank" rel="noopener noreferrer">Bill Gates bought Leonardo da Vinci’s Codex Leicester at auction for $30 million dollars in 1994</a>.&nbsp;<span ariaLabel="exploding head" role="img">🤯</span><br />
							<br />
							About a year ago, I got really inspired by this idea of ‘what would a modern, technical journal look like?’ and ‘why don’t we have more sophisticated tools for knowledge-sharing over the Internet?’ This led me to building Codex.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Does Codex support GitHub Flavored Markdown?
						<Answer>
							Yes! The Codex parser is based on <a className="text-blue-500" href="https://guides.github.com/features/mastering-markdown" target="_blank" rel="noopener noreferrer">GitHub Flavored Markdown</a>. There are <em>few</em> changes where the parser was designed to emphasize WYSIWYG editing, but for all intents and purposes, Codex is GFM-compatible.
							<br />
							Codex supports:<br />
							<br />
							<ul>
								<li>
									<input type="checkbox" checked />
									Headers
								</li>
								<li>
									<input type="checkbox" checked />
									Blockquotes
								</li>
								<li>
									<input type="checkbox" checked />
									Unordered lists
								</li>
								<li>
									<input type="checkbox" checked />
									Ordered lists
								</li>
								<li>
									<input type="checkbox" checked />
									Task items (also known as checklists)
								</li>
								<li>
									<input type="checkbox" checked />
									Code blocks (incl. syntax highlighting)
								</li>
								<li>
									<input type="checkbox" checked />
									Block-level images and linked block-level images
								</li>
								<li>
									<input type="checkbox" checked />
									Section breaks
								</li>
								<li>
									<input type="checkbox" checked />
									<em>Italics</em>
								</li>
								<li>
									<input type="checkbox" checked />
									<strong>Bold</strong>
								</li>
								<li>
									<input type="checkbox" checked />
									<code>code</code>
								</li>
								<li>
									<input type="checkbox" checked />
									<a className="text-blue-500" href="/" target="_blank" rel="noopener noreferrer">Links</a>
								</li>
								<li>
									<input type="checkbox" checked />
									Naked links: <a className="text-blue-500" href="https://codex.md" target="_blank" rel="noopener noreferrer">codex.md</a>
								</li>
								<li>
									<input type="checkbox" checked />
									<strike>Strikethrough</strike>
								</li>
							</ul>
							<br />
							<em>More elements</em> are also planned.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						What if I don’t like markdown syntax?
						<Answer>
							The decision to render markdown was intentional to make authoring <em>and maintaining</em> markdown easier over time.<br />
							<br />
							That being said, I’ve taken great efforts to minimize the impact of markdown; some elements are rendered purely as WYSWYG (like lists and section breaks), and all markdown syntax can be hidden in ‘Preview Mode’, which also locks the document from editing.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Does Codex support embedding media and tables?
						<Answer>
							Not yet, but these are planned features. Not only do I want to provide these kinds of rich elements for you, but I want them myself!
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Does Codex support embedding media and tables?
						<Answer>
							Not yet, but these are planned features. Not only do I want to provide these kinds of rich elements for you, but I want them myself!
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Does Codex support collaborative features like Google Docs or Figma?
						<Answer>
							Not yet. Everything you see has been designed and engineered by one person — that’s me, hello! <span ariaLabel="waving hand" role="img">👋</span> — and I simply haven’t figured out how to engineer collaborative features.<br />
							<br />
							That being said, I deeply want to add collaborative editing! If you’ve worked on collaborative editors before, <a className="text-blue-500" href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">send me a DM so we can talk at length</a>.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Who is Codex designed for?
						<Answer>
							Ultimately, Codex is designed for _anyone_ who wants to author typed content on the web more easily. Specifically, Codex is being developed for the developer community.<br />
							<br />
							In the future, I’d like to make the editor more useful in order to support the wider technical community. I plan on adding support for LaTeX elements and more.
						</Answer>
					</QuestionBlock>
				</div>

				<div className="grid gap-8">
					<QuestionBlock>
						Why are you making Codex?
						<Answer>
							The original plan was to self-publish programming courses on the Internet — I love programming, and I want to share my love of programming with the world. However, I immediately noticed just how inconvenient authoring on the web is. So instead of making courses, I decided to try to solve the bigger problem.<br />
							<br />
							{/* TODO: Small caps? */}
							TL;DR: Editors are <em>hard</em>, and web-based editors are a nightmare. <span ariaLabel="face screaming in fear" role="img">😱</span> This is why you see so few <em>good ones</em>. But anything hard is worth doing, so I’m committed to building Codex for myself and others.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						How does the Codex editor actually work?
						<Answer>
							You might be surprised to learn that the Codex editor (and pretty much all the technology Codex uses) <a className="text-blue-500" href="https://github.com/codex-src" target="_blank" rel="noopener noreferrer">is actually MIT-licensed open source</a>. It’s important to me that everything I’ve learned <em>be learnable</em>.<br />
							<br />
							Back to the question: essentially, I use React and <code>contenteditable</code> to seed control of user-editing to a virtual representation of the document. <code>input</code> events, among other events, manipulate the virtual document. React then re-renders the virtual document <em>back</em> to the screen, diffing changes a long the way.<br />
							<br />
							Of course, the implementation is far more subtle and <em>treacherous</em>. <span ariaLabel="ghost" role="img">👻</span> If you are personally interested in contributing to the Codex editor, <a className="text-blue-500" href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">send me a DM so I can onboard you the various repos Codex uses</a>.<br />
							<br />
							(No — I am not using a popular open source library like <a className="text-blue-500" href="https://github.com/facebook/draft-js" target="_blank" rel="noopener noreferrer">Draft.js</a> or <a className="text-blue-500" href="https://github.com/codemirror/CodeMirror" target="_blank" rel="noopener noreferrer">CodeMirror</a> to engineer Codex. This was an intentional decision to make sure I could learn <em>how</em> editors work and own the editor experience I am building.)
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Can I use Codex for my personal blog?
						<Answer>
							Not yet, but this is a planned feature I’m excited to build. I myself want to use Codex to self-host my own blog. Don’t you?<br />
							<br />
							If you have ideas for how blogging on Codex should work, <a href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">send me a DM so we can talk at length</a>.
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Why should I pay for Codex?
						<Answer>
							<em>You don’t have to.</em> The free tier offers <em>unlimited documents</em>. Please note these documents are limited to 2,000 words.<br />
							<br />
							{/* TODO: Underline? */}
							For reference, 2,000 words is <em>a lot</em> — a 400-page book is on the order of 100,000 words, so 2,000 words gets you 1/50th of a book, for free!<br />
							<br />
							However, when you pay for Codex, you get <em>a lot</em> more:<br />
							<ul>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="books" role="img">📚</span> Unlimited documents (included free)
								</li>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="open book" role="img">📖</span> Unlimited document-length
								</li>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="sunglasses" role="img">🕶</span> Dark mode
								</li>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="alien monster" role="img">👾</span> Monospace-mode
								</li>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="man artist: light skin tone" role="img">👨🏻‍🎨</span> Custom color theming and font-styling
								</li>
								<li>
									<input type="checkbox" checked />
									<span ariaLabel="rocket" role="img">🚀</span> Export your documents to HTML, syntax highlighting included
								</li>
							</ul>
							<br />
							Codex is designed to be inexpensive, the same as one <em>damn good</em> Green Tea Latte per month. <span ariaLabel="teacup without handle" role="img">🍵</span> <strong>By paying for Codex, you make Codex sustainable.</strong>
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Why do you offer a self-service discount?
						<Answer>
							If you need a discount, <a href="TODO" target="_blank" rel="noopener noreferrer">simply toggle the ‘I need a discount’ checkbox on the checkout page</a>. This discount exists to support users who need it.<br />
							<br />
							Codex as a service is already designed to be inexpensive, but when you apply the self-service discount, you take up to 20% off.<br />
							<br />
							Please don’t apply the discount if you don’t need it. <span ariaLabel="face with raised eyebrow" role="img">🤨</span>
						</Answer>
					</QuestionBlock>

					<QuestionBlock>
						Do you offer refunds?
						<Answer>
							Yes. If you’re not satisfied with Codex, send an email to me at <a href="todo" target="_blank" rel="noopener noreferrer">refunds@getcodex.dev</a>. No questions asked.<br />
							<br />
							Please note that refunds are <em>not</em> prorated. <strong>If you didn’t enjoy your experience with Codex, I’ll refund you 100% of your original purchase</strong>, regardless of how long you actually used Codex for. I do this because I mean it when I say I want you to enjoy your stay.<br />
							<br />
							That being said, if you have ideas for how to improve Codex, I graciously ask you share your feedback <em>instead</em> so I can do everything we can to serve you better. <a href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">Simply DM me with your feedback.</a> I’m making Codex to make our collective lives easier, so your feedback potentially helps other people, too. Don’t hesitate to share your honest and open feedback!<br />
							<br />
							<span ariaLabel="red heart" role="img">❤️</span>
						</Answer>
					</QuestionBlock>

				</div>
			</div>

		</AppContainer>
	</div>
)

export default FAQ
