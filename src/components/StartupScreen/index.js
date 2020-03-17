import * as Icons from "svgs"
import Icon from "utils/Icon"
import React from "react"

const StartupScreen = props => (
	<div className="flex flex-row justify-center items-center h-full">
		<Icon className="w-10 h-10 text-md-gray-400" svg={Icons.CodexLogo} />
	</div>
)

export default StartupScreen
