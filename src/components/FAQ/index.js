import AppContainer from "components/AppContainer"
import Button from "lib/Button"
import React from "react"

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
	<div className="text-px text-gray-800">
		{children}
	</div>
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
							Codex is a new WYSIWYG, what-you-see-is-what-you-get, markdown editor and notebook for the developer community.&nbsp;<span aria-label="thumbs up" role="img">👍</span><br />
							<br />
							<strong>Codex enables you to be more productive by helping you focus on what matters.</strong>
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Why is it called /ˈkōˌdeks/?
						<Answer>
							The name ‘Codex’ is actually inspired by <a className="text-blue-500 hover:underline" href="https://en.wikipedia.org/wiki/Codex_Leicester" target="_blank" rel="noopener noreferrer">Leonardo da Vinci’s Codex Leicester</a>. I actually found out when writing this that <a className="text-blue-500 hover:underline" href="https://businessinsider.com/look-inside-the-codex-leicester-which-bill-gates-bought-for-30-million-2015-7" target="_blank" rel="noopener noreferrer">Bill Gates bought Leonardo da Vinci’s Codex for $30 million</a>.&nbsp;<span aria-label="exploding head" role="img">🤯</span><br />
							<br />
							I got really inspired by this idea of ‘what would a modern, technical journal look like?’ and ‘why don’t we have one?’ This led me to building Codex.
						</Answer>
					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Is Codex based on GitHub Flavored Markdown?
						<Answer>
							Yes! The Codex parser is based on <a className="text-blue-500 hover:underline" href="https://guides.github.com/features/mastering-markdown" target="_blank" rel="noopener noreferrer">GitHub Flavored Markdown</a>.<br />
							<br />
							So far, Codex supports:<br />
							<br />
							<ul>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Headers
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Blockquotes
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Unordered lists
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Ordered lists
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Task items (also known as checklists)
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Code blocks (includes syntax highlighting)
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Images
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									Section breaks
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<em>Italics</em>
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<strong>Bold</strong>
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">code</code>
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<Button className="text-blue-500 hover:underline" >Links</Button> and naked links: <Button className="text-blue-500 hover:underline">https://codexapp.dev</Button>
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
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
							You might be surprised to learn that the Codex editor (and pretty much all the technology Codex uses) is <a className="text-blue-500 hover:underline" href="https://github.com/codex-src" target="_blank" rel="noopener noreferrer">MIT-licensed open source</a>. It’s important to me that everything I’ve learned <em>be learnable</em>.<br />
							<br />
							Essentially, I use React and <code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">contenteditable</code> to seed control of user-editing to a virtual document representation (VDOM). <code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">keydown</code> and <code className="px-1 py-px font-mono -text-px text-md-blue-a400 border rounded">input</code> events, among other events, manipulate the VDOM. Finally, React rerenders the virtual document back to the DOM.<br />
							<br />
							Of course, the implementation is far more subtle and treacherous.&nbsp;<span aria-label="ghost" role="img">👻</span>.<br />
							<br />
							(No — I’m not using a popular open source library like <a className="text-blue-500 hover:underline" href="https://github.com/facebook/draft-js" target="_blank" rel="noopener noreferrer">Draft.js</a> or <a className="text-blue-500 hover:underline" href="https://github.com/codemirror/CodeMirror" target="_blank" rel="noopener noreferrer">CodeMirror</a> to engineer the Codex editor.)
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
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="books" role="img">📚</span> Unlimited notes (included in the free tier)
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="open book" role="img">📖</span> Unlimited note-length
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="sunglasses" role="img">🕶</span> Dark mode
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="alien monster" role="img">👾</span> Monospace-mode
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="man artist: light skin tone" role="img">👨🏻‍🎨</span> Custom color theming and font-styling
								</li>
								<li className="my-px">
									<input className="form-checkbox mr-3 text-green-400 rounded-full shadow transform scale-105 pointer-events-none" type="checkbox" defaultChecked tabIndex="-1" />
									<span aria-label="rocket" role="img">🚀</span> Export notes to HTML
								</li>
							</ul>
						</Answer>

					</QuestionBlock>

					<div className="h-6" />
					<QuestionBlock>
						Do you offer refunds?
						<Answer>
							Yes. If you’re not satisfied with Codex, email me at <a className="text-blue-500 hover:underline" href="mailto:support@codexapp.dev" target="_blank" rel="noopener noreferrer">support@codexapp.dev</a> within 30 days of your original purchase and I’ll refund you in full, no questions asked.
						</Answer>
					</QuestionBlock>

				</div>
			</div>

		</AppContainer>
	</div>
)

export default FAQ
