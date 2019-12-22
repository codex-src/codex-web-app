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
		console.warn(`ErrorBoundary.componentDidCatch=${error.message}`)
	}
	render() {
		return this.props.children
	}
}

export default ErrorBoundary
