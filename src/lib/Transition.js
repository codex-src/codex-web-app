import React from "react"
import { CSSTransition } from "react-transition-group"

// https://github.com/adamwathan/tailwind-ui-navbar-react/blob/1bbfde78deb96befc371d8726e41a32bdd66403d/pages/index.js#L4
function Transition({
	unmountOnExit,
	show,
	enter,
	enterFrom,
	enterTo,
	enterActive,
	leave,
	leaveFrom,
	leaveTo,
	leaveActive,
	children,
}) {
	const enterClasses = enter.split(/\s+/)
	const enterFromClasses = enterFrom.split(/\s+/)
	const enterToClasses = enterTo.split(/\s+/)
	const leaveClasses = leave.split(/\s+/)
	const leaveFromClasses = leaveFrom.split(/\s+/)
	const leaveToClasses = leaveTo.split(/\s+/)

	return (
		<CSSTransition
			unmountOnExit={unmountOnExit === undefined ? true : unmountOnExit}
			in={show}
			addEndListener={(node, done) => {
				node.addEventListener("transitionend", done, false)
			}}
			onEnter={node => {
				if (!unmountOnExit) {
					node.classList.remove(...leaveToClasses)
				}
				node.classList.add(...enterClasses, ...enterFromClasses)
			}}
			onEntering={node => {
				node.classList.remove(...enterFromClasses)
				node.classList.add(...enterToClasses)
			}}
			onEntered={node => {
				if (unmountOnExit) {
					node.classList.remove(...enterToClasses)
				}
				node.classList.remove(...enterClasses)
			}}
			onExit={node => {
				if (!unmountOnExit) {
					node.classList.remove(...enterToClasses)
				}
				node.classList.add(...leaveClasses, ...leaveFromClasses)
			}}
			onExiting={node => {
				node.classList.remove(...leaveFromClasses)
				node.classList.add(...leaveToClasses)
			}}
			onExited={node => {
				if (unmountOnExit) {
					node.classList.remove(...leaveToClasses)
				}
				node.classList.remove(...leaveClasses)
			}}
		>
			{children}
		</CSSTransition>
	)
}

export default Transition
