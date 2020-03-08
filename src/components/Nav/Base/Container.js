import Context from "../Context"
import React from "react"

const Container = props => {
	const ref = React.useRef()

	const rootProps = React.useContext(Context)
	const { absolute } = rootProps

	React.useLayoutEffect(() => {
		if (absolute) {
			ref.current.classList.remove("fixed")
			ref.current.classList.add("absolute")
			return
		}
		const handler = e => {
			if (!window.scrollY) {
				ref.current.classList.remove("shadow-hero")
			} else {
				ref.current.classList.add("shadow-hero")
			}
		}
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [absolute])

	return (
		<div ref={ref} className="fixed inset-x-0 top-0 flex flex-row justify-center bg-white z-30 trans-300">
			<div className="px-6 w-full max-w-screen-lg h-20">
				<div className="relative flex flex-row justify-between h-full">
					{props.children}
				</div>
			</div>
		</div>
	)
}

export default Container
