import invariant from "invariant"
import React from "react"

// https://reactjs.org/docs/error-boundaries
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}
	static getDerivedStateFromError(error) {
		return { hasError: true }
	}
	componentDidCatch(error, errorInfo) {
		invariant(`error=${error} errorInfo=${errorInfo}`)
	}
	render() {
		return this.props.children
	}
}

export default ErrorBoundary
