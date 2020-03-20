import * as Hero from "react-heroicons"
import Icon from "utils/Icon"
import React from "react"

const DarkModeIcon = ({ darkMode, ...props }) => (
	<Icon
		className="w-6 h-6 text-md-blue-a400 dark:text-md-blue-a100"
		svg={!darkMode
			? Hero.SunOutlineMd
			: Hero.SunSolidSm
		}
	/>
)

export default DarkModeIcon
