import React from "react"
import paths from "paths"
import { Link } from "react-router-dom"
import { WideAppContainer } from "components/AppContainers"

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
	<div className="text-gray-800">
		{children}
	</div>
)

const FAQ = () => (
	<div className="py-24 border-t-4 border-gray-100">
		<WideAppContainer>

			{/* Questions */}
			<h2 className="flex flex-row items-center text-3xl md:text-4xl font-semibold Poppins text-gray-900" style={{ clipPath: "inset(0 0 18.75% 0)" }}>
				Frequently asked questions
			</h2>

			{/* Answers */}
			<div style={{ height: "2.25rem" /* h-9 */ }} />
			<div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "2.25rem" /* gap-9 */ }}>

				{/* LHS */}
				<div>
					<QuestionBlock>
						What is Codex?
						<Answer>
							Codex is a new WYSIWYG, what-you-see-is-what-you-get, markdown editor and notebook for developers, based on web technologies.<br />
							<br />
							<strong>Codex enables you to work more productively by helping you focus on what matters — your writing.</strong>
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Why is it called /ˈkōˌdeks/?
						<Answer>
							The name ‘Codex’ is primarily inspired by <a className="text-md-blue-a400" href="https://en.wikipedia.org/wiki/Codex_Leicester" target="_blank" rel="noopener noreferrer">Leonardo da Vinci’s Codex Leicester</a>. I actually found out when writing this that <a className="text-md-blue-a400" href="https://businessinsider.com/look-inside-the-codex-leicester-which-bill-gates-bought-for-30-million-2015-7" target="_blank" rel="noopener noreferrer">Bill Gates bought the Codex Leicester for $30 million dollars back in 1994</a>.&nbsp;<span aria-label="exploding head" role="img">🤯</span><br />
							<br />
							About a year ago, I got really inspired by this idea of ‘what would a modern, technical journal look like?’ and ‘why don’t we have more sophisticated tools for knowledge-sharing over the Internet?’ This led me to building Codex.
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Is Codex based on GitHub Flavored Markdown?
						<Answer>
							Yes! The Codex parser is based on <a className="text-md-blue-a400" href="https://guides.github.com/features/mastering-markdown" target="_blank" rel="noopener noreferrer">GitHub Flavored Markdown</a>. There are <em>few</em> changes where the parser was designed to emphasize WYSIWYG editing, but for all intents and purposes, Codex is GFM-compatible.<br />
							<br />
							Codex supports (so far):<br />
							<br />
							<ul>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Headers
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Blockquotes
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Unordered lists
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Ordered lists
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Task items (also known as checklists)
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Code blocks (includes syntax highlighting)
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Images
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Section breaks
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<em>Italics</em>
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<strong>Bold</strong>
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">code</code>
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<Link to={paths.home} className="text-md-blue-a400">Links</Link>
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Naked links: <Link to={paths.home} className="text-md-blue-a400">https://codex.md</Link>
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<strike className="text-gray-500">Strikethrough</strike>
								</li>
							</ul>
							{/* <br /> */}
							{/* <em>More elements</em> are also planned! */}
						</Answer>
					</QuestionBlock>

					{/* <QuestionBlock> */}
					{/* 	What if I don’t like markdown syntax? */}
					{/* 	<Answer> */}
					{/* 		The decision to render markdown was intentional to make authoring <em>and maintaining</em> markdown easier over time.<br /> */}
					{/* 		<br /> */}
					{/* 		That being said, I’ve taken great efforts to minimize the impact of markdown; some elements are rendered purely as WYSIWYG (like lists and section breaks), and all markdown syntax can be hidden in ‘Preview Mode’, which also locks the document from editing. */}
					{/* 	</Answer> */}
					{/* </QuestionBlock> */}

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Does Codex support embeds and tables?
						<Answer>
							Not yet, but these are planned features.
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Does Codex support collaborative features?
						<Answer>
							Not yet. Everything you see has been designed and engineered by one person — that’s me, hello!&nbsp;<span aria-label="waving hand" role="img">👋</span> — and I simply haven’t figured out how to engineer collaborative features…yet.
						</Answer>
					</QuestionBlock>

					{/* <QuestionBlock> */}
					{/* 	Who is Codex designed for? */}
					{/* 	<Answer> */}
					{/* 		Ultimately, Codex is designed for <em>anyone</em> who wants to author written content on the web more easily. Specifically, Codex is being developed for the developer community.&nbsp;<span aria-label="hugging face" role="img">🤗</span><br /> */}
					{/* 		<br /> */}
					{/* 		In the future, I’d like to make the editor more useful in order to support the greater technical community. I plan on adding support for LaTeX elements and more. */}
					{/* 	</Answer> */}
					{/* </QuestionBlock> */}
				</div>

				{/* RHS */}
				<div>
					<QuestionBlock>
						Why are you making Codex?
						<Answer>
							The original plan was to self-publish programming courses on the Internet — I love programming, and I want to share my love of programming with the world. However, I immediately noticed just how inconvenient authoring even written content on the web is. So instead of making courses, I decided to try to solve the bigger problem.<br />
							<br />
							Editors are <em>hard</em>, and web-based editors are the stuff of nightmares.&nbsp;<span aria-label="face screaming in fear" role="img">😱</span> This is why you see so few good ones. But anything hard is worth doing, so I’m committed to building Codex for myself and others.
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						How does the Codex editor actually work?
						<Answer>
							You might be surprised to learn that the Codex editor (and pretty much all the technology Codex uses) is <a className="text-md-blue-a400" href="https://github.com/codex-src" target="_blank" rel="noopener noreferrer">MIT-licensed open source</a>. It’s important to me that everything I’ve learned <em>be learnable</em>.<br />
							<br />
							Back to the question: essentially, I use React and <code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">contenteditable</code> to seed control of user-editing to a virtual representation of the document. <code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">input</code> events, among other events, manipulate the virtual document. React then re-renders the virtual document <em>back</em> to the screen.<br />
							{/* <br /> */}
							{/* Of course, the implementation is far more subtle and <em>treacherous</em>.&nbsp;<span aria-label="ghost" role="img">👻</span> If you are personally interested in contributing to the Codex editor, <a className="text-md-blue-a400" href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">send me a DM so I can onboard</a>.<br /> */}
							<br />
							(No — I’m not using a popular open source library like <a className="text-md-blue-a400" href="https://github.com/facebook/draft-js" target="_blank" rel="noopener noreferrer">Draft.js</a> or <a className="text-md-blue-a400" href="https://github.com/codemirror/CodeMirror" target="_blank" rel="noopener noreferrer">CodeMirror</a> to engineer Codex.)
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Can I use Codex for my personal blog?
						<Answer>
							Not yet, but this is a planned feature I’m excited to build. I myself want to use Codex to host my blog. Don’t you?<br />
							<br />
							If you have ideas for how blogging should work on Codex, <a className="text-md-blue-a400" href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">send me a DM</a>.
						</Answer>
					</QuestionBlock>

					<div style={{ height: "2.25rem" /* h-9 */ }} />
					<QuestionBlock>
						Why should I pay for Codex?
						<Answer>
							You don’t have to. The free tier offers unlimited documents, each limited to 2,000 words. For reference, 2k words is <em>a lot</em> — a 400-page book is on the order of 100k words, so 2k words gets you 1/50th of a book, for free!<br />
							<br />
							However, when you pay for Codex, you get <em>a lot</em> more:<br />
							<br />
							<ul>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="books" role="img">📚</span> Unlimited documents (included in the free tier)
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="open book" role="img">📖</span> Unlimited document-length
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="sunglasses" role="img">🕶</span> Dark mode
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="alien monster" role="img">👾</span> Monospace-mode
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="man artist: light skin tone" role="img">👨🏻‍🎨</span> Custom color theming and font-styling
								</li>
								<li>
									<input className="form-checkbox mr-3 text-md-blue-a200 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="rocket" role="img">🚀</span> Export documents to HTML
								</li>
							</ul>
							<br />
							Codex is designed to be inexpensive, the same as one <em>damn good</em> Green Tea Latte per month.&nbsp;<span aria-label="teacup without handle" role="img">🍵</span> <strong>By paying for Codex, you make Codex sustainable.</strong>
						</Answer>
					</QuestionBlock>

					{/* <QuestionBlock> */}
					{/* 	Why do you offer a self-service discount? */}
					{/* 	<Answer> */}
					{/* 		If you need a discount, <Link to={paths.pricing} className="text-md-blue-a400">simply toggle the ‘I need a discount’ checkbox on the pricing page</Link>. This discount exists to support users who need it.<br /> */}
					{/* 		<br /> */}
					{/* 		Codex as a service is already designed to be inexpensive, but when you apply the self-service discount, you take up to 20% off.<br /> */}
					{/* 		<br /> */}
					{/* 		Please don’t apply the discount if you don’t need it.&nbsp;<span aria-label="face with raised eyebrow" role="img">🤨</span> */}
					{/* 	</Answer> */}
					{/* </QuestionBlock> */}

					{/* <QuestionBlock> */}
					{/* 	Do you offer refunds? */}
					{/* 	<Answer> */}
					{/* 		Yes. If you’re not satisfied with Codex, email me at <a className="text-md-blue-a400" href="mailto:support@codex.md" target="_blank" rel="noopener noreferrer">support@codex.md</a> within 30 days and I’ll refund you in full, no questions asked.<br /> */}
					{/* 		<br /> */}
					{/* 		That being said, if you have ideas for how to improve Codex, <a className="text-md-blue-a400" href="https://twitter.com/username_ZAYDEK" target="_blank" rel="noopener noreferrer">DM me with feedback</a>. Don’t hesitate to share your honest and open feedback!<br /> */}
					{/* 		<br /> */}
					{/* 		<span aria-label="red heart" role="img">❤️</span> */}
					{/* 	</Answer> */}
					{/* </QuestionBlock> */}
				</div>
			</div>

		</WideAppContainer>
	</div>
)

export default FAQ
