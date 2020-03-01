import * as constants from "__constants"
import * as Feather from "react-feather"
import * as Hero from "utils/heroicons"
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
	<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
		{[...new Array(20)].map((_, index) => (
			!index ? (
				<div className="relative bg-gray-100 rounded-xl trans-150">
					<Link key={index} className="pb-2/3 relative block" to={constants.TODO}>
						<div className="-mb-4 absolute inset-0 flex flex-col justify-center items-center">
							<Feather.Plus className="mb-4 w-8 h-8 text-md-blue-a400" />
							<h1 className="font-brand-sans-round font-medium text-2xl text-md-blue-a400">
								New note
							</h1>
						</div>
					</Link>
				</div>
			) : (
				<div className="relative bg-white rounded-lg shadow-hero hover:shadow-hero-lg trans-150">
					<Link key={index} className="pb-2/3 relative block" to={constants.TODO}>
						<div className="absolute inset-0">
							<div className="relative h-full overflow-y-scroll scrolling-touch trans-150">
								<GridEditor />
								{/* NOTE: Use flex flex-col justify-end */}
							</div>
						</div>
					</Link>
				</div>
			)
		))}
	</div>
)

export default GridView
