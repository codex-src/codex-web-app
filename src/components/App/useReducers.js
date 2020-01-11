import React from "react"
import useMethods from "use-methods"

const initialState = {
	value: 0,
}

const increment = state => (amount = 1) => {
	state.value += amount
}

const incrementReducer = state => ({
	increment: increment(state),
})

const decrementReducer = state => ({
	decrement() {
		this.increment(-1)
	},
})

const reducer = state => ({
	...decrementReducer(state),
	...incrementReducer(state),
})

function App(props) {
	const [{ value }, dispatch] = useMethods(reducer, initialState)

	return (
		<form onSubmit={e => e.preventDefault()}>
			<input
				type="button"
				value="+"
				onClick={e => dispatch.increment()}
			/>
			<input
				type="button"
				value="-"
				onClick={e => dispatch.decrement()}
			/>
			<div>
				{value}
			</div>
		</form>
	)
}

export default App
