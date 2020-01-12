import React from "react"
import stylex from "stylex"
import useMethods from "use-methods"

const initialState = {
	values: [],
}

const reducer = state => ({
	push() {
		state.values.push(Math.random().toString(16).slice(2, 8))
	},
})

// `VDOMNode` adds attributes to a render function.
const VDOMNode = render => React.memo(({ reactKey, ...props }) => {
	const element = render(props)
	const newRender = React.cloneElement(
		element,
		{
			"data-vdom-node": true,
			"data-vdom-unix": Date.now(),
			...element.props,
		},
	)
	return newRender
})

const Item = VDOMNode(props => (
	<pre>
		{props.children}
	</pre>
))

function App(props) {
	const [{ values }, dispatch] = useMethods(reducer, initialState)

	return (
		<div style={stylex.parse("p-x:24 p-y:64 flex -r -x:center")}>
			<form style={stylex.parse("flex -c -x:center")} onSubmit={e => e.preventDefault()}>
				<input
					type="button"
					value="add"
					onClick={dispatch.push}
				/>
				{values.map(each => (
					<Item key={each}>
						{each}
					</Item>
				))}
			</form>
		</div>
	)
}

export default App
