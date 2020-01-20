import random from "utils/random/id"
import React from "react"
import useMethods from "utils/useMethods"

const initialState = {
	todo: "",
	todos: null,
}

// Initializes a useReducer state.
function init(initialState) {
	const imperative = { ...initialState }
	imperative.todos = []
	return imperative
}

// methodsReducer is a reducer (for useReducer) with the
// same API as useMethods.
//
// https://github.com/pelotom/use-methods
const methodsReducer = state => ({
	// Sets the todo; writes to todo.
	setTodo(value) {
		const imperative = { ...state, todo: state.todo }
		imperative.todo = value
		return imperative
	},
	// Adds a todo; writes to todos and todo.
	addTodo() {
		if (!state.todo) {
			// No-op
			return state
		}
		const imperative = { ...state, todos: [...state.todos], todo: state.todo }
		imperative.todos.unshift({ key: random.newUUID(), value: imperative.todo })
		imperative.todo = ""
		return imperative
	},
	// Removes a todo; writes to todos.
	removeTodo(key) {
		const imperative = { ...state, todos: [...state.todos] }
		const index = imperative.todos.findIndex(each => each.key === key)
		imperative.todos.splice(index, 1)
		return imperative
	},
})

function App(props) {
	const [state, dispatch] = useMethods(methodsReducer, initialState, init)

	return (
		<div>
			<form onSubmit={e => {
				e.preventDefault(); dispatch.addTodo()
			}}>
				<input
					type="text"
					value={state.todo}
					onChange={e => dispatch.setTodo(e.target.value)}
				/>
				<input type="submit" value="submit" />
			</form>
			{state.todos.map(each => (
				<div key={each.key}>
					<input
						type="button"
						value="delete"
						onClick={e => dispatch.removeTodo(each.key)}
					/>
					{` ${each.value}`}
				</div>
			))}
			<pre style={{ tabSize: 2 }}>
				{JSON.stringify(state, null, "\t")}
			</pre>
		</div>
	)
}

export default App
