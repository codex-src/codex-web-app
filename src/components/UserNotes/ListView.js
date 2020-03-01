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
				<Link className="my-2 p-4 flex flex-row hover:bg-gray-100 rounded-lg trans-150" to={constants.TODO}>
					<div className="mr-8 flex-shrink-0 w-24">
						<div className="pb-3/4 relative">
							<div className="absolute inset-0">
								<Link className="h-full bg-white rounded-md shadow-hero-md hover:shadow-hero-lg overflow-y-hidden trans-150">
									<ListEditor />
								</Link>
							</div>
						</div>
					</div>
					<div className="-mt-2 !truncate">
						<div className="my-1 flex flex-row justify-between items-center">
							<p className="font-semibold text-lg tracking-px truncate">
								How to build a beautiful blog
							</p>
							{/* <p className="font-medium tracking-px text-gray-500"> */}
							{/* 	Last edited 3 days ago */}
							{/* </p> */}
						</div>
						<div className="my-1">
							<p className="text-lg tracking-px text-gray-500 !truncate" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit
							</p>
						</div>
						<div className="mt-4">
							<p className="font-semibold text-xs tracking-widest text-gray-500">
								LAST EDITED 3 DAYS AGO
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
