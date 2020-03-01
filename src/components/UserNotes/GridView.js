import * as constants from "__constants"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import React from "react"

const MODIFIER = 0.67

const GridEditor = props => (
	<MockEditor
		baseFontSize={16 * MODIFIER}
		paddingX={32 * MODIFIER}
		paddingY={32 * MODIFIER}
	/>
)

const GridView = props => (
	<div className="grid grid-cols-3 gap-6">
		{[...new Array(20)].map((_, index) => (
			<div className="relative bg-white rounded-lg shadow-hero hover:shadow-hero-lg overflow-hidden trans-150">
				<Link key={index} className="pb-2/3 relative block" to={constants.TODO}>
					<div className="absolute inset-0">
						<div className="relative h-full overflow-y-scroll scrolling-touch trans-150">
							<GridEditor />
							{/* NOTE: Use flex flex-col justify-end */}
						</div>
					</div>
				</Link>
				{/* <div className="absolute inset-0 flex flex-col justify-end opacity-0 hover:opacity-100 trans-150"> */}
				{/* 	<div className="px-6 py-2 !truncate bg-gray-100"> */}
				{/* 		<h2 className="font-semibold -text-px tracking-px truncate"> */}
				{/* 			How to build a beautiful blog asdasdasdasd */}
				{/* 		</h2> */}
				{/* 		<p className="font-medium text-xs tracking-wider text-gray-700"> */}
				{/* 			2 MINUTES AGO */}
				{/* 		</p> */}
				{/* 	</div> */}
				{/* </div> */}
			</div>
		))}
	</div>
)

export default GridView
