import * as User from "components/User"
import NavAuth from "./NavAuth"
import NavUnauth from "./NavUnauth"
import React from "react"

const Nav = props => {
	const ref = React.useRef()

	const user = User.useUser()

	React.useLayoutEffect(() => {
		if (props.absolute) {
			ref.current.classList.remove("fixed")
			ref.current.classList.add("absolute")
			return
		}
		const handler = e => {
			if (!window.scrollY) {
				ref.current.classList.remove("shadow")
			} else {
				ref.current.classList.add("shadow")
			}
		}
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [props.absolute])

	let Component = null
	if (!user) {
		Component = NavUnauth
	} else {
		Component = NavAuth
	}
	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white z-30 trans-300">
			<div className="px-6 w-full max-w-screen-lg h-16">
				<div className="relative flex flex-row justify-between h-full">
					<Component />
				</div>
			</div>
		</div>
	)
}

export default Nav
