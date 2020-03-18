import * as Hero from "react-heroicons"
import Icon from "utils/Icon"
import React from "react"

const DarkModeIcon = ({ darkMode, ...props }) => {
	let svg = null
	if (!darkMode) {
		svg = Hero.SunOutlineMd
	} else {
		svg = Hero.SunSolidSm
	}
	return <Icon className="w-6 h-6 text-md-blue-a400 dark:text-md-blue-a100" svg={svg} />
}

export default DarkModeIcon
