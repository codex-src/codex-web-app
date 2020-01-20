import random from "utils/random/id"
import React from "react"

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

// https://github.com/pelotom/use-methodsReducer/blob/master/src/index.ts
function useMethods(methodsReducer, initialState, init) {
	const reducer = React.useMemo(() => (state, action) => methodsReducer(state)[action.type](...action.payload), [methodsReducer])
	const [state, dispatch] = React.useReducer(reducer, initialState, init)
	// NOTE: We don’t need to add methodsReducer and state to
	// dependencies because they are created on every render.
	//
	// https://github.com/facebook/react/issues/14920#issuecomment-467212561
	const callbacks = React.useMemo(() => {
		const types = Object.keys(methodsReducer(state))
		return types.reduce((accum, type) => {
			accum[type] = (...payload) => dispatch({ type, payload })
			return accum
		}, {})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	return [state, callbacks]
}

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
