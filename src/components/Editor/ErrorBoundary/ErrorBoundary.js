import React from "react"
import stylex from "stylex"

// FIXME: Allow the user to copy the editor’s current state.
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			didError: false, // Did React throw?
		}
	}
	static getDerivedStateFromError(error) {
		return { didError: true }
	}
	componentDidCatch(error, errorInfo) {
		console.warn(error.message)
	}
	render() {
		return (
			<React.Fragment>
				{this.state.didError && (
					<div style={stylex.parse("absolute -x -y b:black -a:10% z:max")}>
						<div style={stylex.parse("m-t:-80 flex -r :center h:max")}>
							<div style={stylex.parse("p:24 p-y:20 flex -r :center w:384 b:white br:8")}>
								<div>
									<h1 style={stylex.parse("fw:700 fs:19")}>
										Uh oh!
									</h1>
									<div style={stylex.parse("h:4")} />
									<p style={stylex.parse("fs:12 ls:2.5% c:red")}>
										ERROR_BOUNDARY
									</p>
									<div style={stylex.parse("h:16")} />
									<p style={stylex.parse("c:gray-800")}>
										Please refresh or try again later. We’ve been notified of the issue.
									</p>
									<div style={stylex.parse("h:16")} />
									<a style={stylex.parse("pointer")} href={window.location.href}>
										<p style={stylex.parse("c:blue-a400")}>
											Tap here to refresh the page
										</p>
									</a>
								</div>
							</div>
						</div>
					</div>
				)}
				{this.props.children}
			</React.Fragment>
		)
	}
}

export default ErrorBoundary
