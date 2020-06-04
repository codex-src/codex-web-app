import React from "react"

const TransitionV2 = ({
	on,         // boolean
	transition, // string e.g. "transition duration-150 ease-in-out"
	from,       // string e.g. "transform rotate-0"
	to,         // string e.g. "transform rotate-90"
	children,   // etc.
}) => {
	const ref = React.useRef()

	const transitionClasses = (transition || "").split(/\s+/)
	const fromClasses = from.split(/\s+/)
	const toClasses = to.split(/\s+/)

	const mounted = React.useRef()
	React.useLayoutEffect(() => {
		const actualRef = children.ref || ref
		if (!mounted.current && transitionClasses.length) {
			actualRef.current.classList.add(...transitionClasses)
		}
		if (!on) {
			actualRef.current.classList.remove(...toClasses)
			actualRef.current.classList.add(...fromClasses)
		} else {
			actualRef.current.classList.remove(...fromClasses)
			actualRef.current.classList.add(...toClasses)
		}
	}, [
		on,
		children.ref,
		ref,
		transitionClasses,
		fromClasses,
		toClasses,
	])

	return !children.ref ? React.cloneElement(children, { ref }) : children
}

export default TransitionV2
