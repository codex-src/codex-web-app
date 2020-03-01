import * as constants from "__constants"
import CSSDebugger from "utils/CSSDebugger"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import React from "react"

const MODIFIER = 0.25

const ListEditor = props => (
	<MockEditor
		baseFontSize={16 * MODIFIER}
		paddingX={32 * MODIFIER}
		paddingY={32 * MODIFIER}
	/>
)

const ListView = props => (
	<React.Fragment>
		{[...new Array(20)].map((_, index) => (
			<React.Fragment key={index}>
				<Link className="my-2 px-3 py-4 flex flex-row items-center hover:bg-gray-100 rounded-xl trans-150" to={constants.TODO}>
					<div className="mr-6 flex-shrink-0 w-24">
						<div className="pb-3/4 relative">
							<div className="absolute inset-0">
								<Link className="h-full bg-white rounded-lg shadow-hero-lg hover:shadow-hero-xl overflow-y-hidden trans-150">
									<ListEditor />
								</Link>
							</div>
						</div>
					</div>
					<div className="truncate">
						<div className="my-1 flex flex-row">
							<h2 className="font-semibold text-lg tracking-px truncate">
								How to build a beautiful blog
							</h2>
						</div>
						<div className="my-1 flex flex-row">
							<p className="mr-4 text-lg tracking-px text-gray-500">
								Jan 8
							</p>
							<p className="text-lg tracking-px text-gray-500 truncate">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit
							</p>
						</div>
					</div>
				</Link>
				{/* <hr /> */}
				{/* <div className="h-1 bg-gray-100" /> */}
			</React.Fragment>
		))}
		{/* <CSSDebugger /> */}
	</React.Fragment>
)

export default ListView
