import AppContainer from "components/AppContainer"
import React from "react"

// Renders a question block -- children[0] is the question
// and children[1] is an <Answer>.
const QuestionBlock = ({ children }) => (
	<div>
		<h3 className="text-lg Poppins font-medium text-gray-900" style={{ clipPath: "inset(0 0 18.75% 0)" }}>
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
			<div className="h-6" />
			<div className="block md:grid md:grid-cols-2 md:gap-8">

				<QuestionBlock>
					Why is it “early access”?
					<Answer>
						We're really happy with the components we've put together so far,{" "}
						but we've still got a ton more we're planning to build.<br />
						<br />
						Every component you see in the preview is available to use today,{" "}
						but that's only about 25% of what we have planned.<br />
						<br />
						Instead of waiting until we've completely exhausted our own ideas before releasing the product,{" "}
						we decided to open it up as soon as we had enough to be useful so you can start getting value from it right away.<br />
						<br />
						We'll be adding new components on a regular basis,{" "}
						based on our own ideas and on suggestions from early access customers.
					</Answer>
				</QuestionBlock>

				<QuestionBlock>
					Why is it “early access”?
					<Answer>
						We're really happy with the components we've put together so far,{" "}
						but we've still got a ton more we're planning to build.<br />
						<br />
						Every component you see in the preview is available to use today,{" "}
						but that's only about 25% of what we have planned.<br />
						<br />
						Instead of waiting until we've completely exhausted our own ideas before releasing the product,{" "}
						we decided to open it up as soon as we had enough to be useful so you can start getting value from it right away.<br />
						<br />
						We'll be adding new components on a regular basis,{" "}
						based on our own ideas and on suggestions from early access customers.
					</Answer>
				</QuestionBlock>

				<QuestionBlock>
					Why is it “early access”?
					<Answer>
						We're really happy with the components we've put together so far,{" "}
						but we've still got a ton more we're planning to build.<br />
						<br />
						Every component you see in the preview is available to use today,{" "}
						but that's only about 25% of what we have planned.<br />
						<br />
						Instead of waiting until we've completely exhausted our own ideas before releasing the product,{" "}
						we decided to open it up as soon as we had enough to be useful so you can start getting value from it right away.<br />
						<br />
						We'll be adding new components on a regular basis,{" "}
						based on our own ideas and on suggestions from early access customers.
					</Answer>
				</QuestionBlock>

				<QuestionBlock>
					Why is it “early access”?
					<Answer>
						We're really happy with the components we've put together so far,{" "}
						but we've still got a ton more we're planning to build.<br />
						<br />
						Every component you see in the preview is available to use today,{" "}
						but that's only about 25% of what we have planned.<br />
						<br />
						Instead of waiting until we've completely exhausted our own ideas before releasing the product,{" "}
						we decided to open it up as soon as we had enough to be useful so you can start getting value from it right away.<br />
						<br />
						We'll be adding new components on a regular basis,{" "}
						based on our own ideas and on suggestions from early access customers.
					</Answer>
				</QuestionBlock>

				<QuestionBlock>
					Why is it “early access”?
					<Answer>
						We're really happy with the components we've put together so far,{" "}
						but we've still got a ton more we're planning to build.<br />
						<br />
						Every component you see in the preview is available to use today,{" "}
						but that's only about 25% of what we have planned.<br />
						<br />
						Instead of waiting until we've completely exhausted our own ideas before releasing the product,{" "}
						we decided to open it up as soon as we had enough to be useful so you can start getting value from it right away.<br />
						<br />
						We'll be adding new components on a regular basis,{" "}
						based on our own ideas and on suggestions from early access customers.
					</Answer>
				</QuestionBlock>

			</div>

		</AppContainer>
	</div>
)

export default FAQ
