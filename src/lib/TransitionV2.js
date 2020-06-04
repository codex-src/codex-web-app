import React from "react"

const TransitionV2 = ({ on, before, after, children }) => {
	const ref = React.useRef()

	const beforeClasses = before.split(/\s+/)
	const afterClasses = after.split(/\s+/)

	React.useLayoutEffect(() => {
		const actualRef = children.ref || ref
		if (!on) {
			actualRef.current.classList.remove(...beforeClasses)
			actualRef.current.classList.add(...afterClasses)
			// TODO
		} else {
			actualRef.current.classList.remove(...afterClasses)
			actualRef.current.classList.add(...beforeClasses)
		}
	}, [on, children.ref, ref])

	return !children.ref ? React.cloneElement(children, { ref }) : children
}

export default TransitionV2
