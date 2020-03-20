import * as DarkMode from "components/DarkMode"
import * as Hero from "react-heroicons"
import Icon from "utils/Icon"
import React from "react"

const NavButtonDarkMode = props => {
	const [darkMode, setDarkMode] = DarkMode.useDarkMode()

	return (
		<button className="px-3 flex flex-row items-center" onPointerDown={e => e.preventDefault()} onClick={e => setDarkMode(!darkMode)}>
			<Icon
				className="w-6 h-6 text-md-blue-a400 dark:text-md-blue-a100"
				svg={!darkMode
					? Hero.SunOutlineMd
					: Hero.SunSolidSm
				}
			/>
		</button>
	)
}

export default NavButtonDarkMode
