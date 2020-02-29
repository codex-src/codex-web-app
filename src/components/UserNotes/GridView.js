import * as constants from "__constants"
import Link from "components/Link"
import MockEditor from "./MockEditor"
import React from "react"

import "./GridView.css"

const GridView = props => (
	<div className="grid">
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
		<div className="grid-item">
			<Link className="pb-2/3 relative block" to={constants.TODO}>
				<div className="absolute inset-0">
					<div className="h-full bg-white rounded-lg shadow-hero overflow-y-scroll scrolling-touch tx-150">
						<MockEditor />
					</div>
				</div>
			</Link>
		</div>
	</div>
)

export default GridView
