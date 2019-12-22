import invariant from "invariant"
import React from "react"

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}
	static getDerivedStateFromError(error) {
		return { hasError: true }
	}
	componentDidCatch(error, errorInfo) {
		invariant(false, `ErrorBoundary.componentDidCatch=${error.message}`)
	}
	render() {
		return this.props.children
	}
}

export default ErrorBoundary
