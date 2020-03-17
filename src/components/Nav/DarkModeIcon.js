import * as Hero from "react-heroicons"
import Icon from "utils/Icon"
import React from "react"

const DarkModeIcon = ({ darkMode, ...props }) => (
	<Icon svg={!darkMode ? Hero.SunOutlineMd : Hero.SunSolidSm} {...props} />
)

export default DarkModeIcon
