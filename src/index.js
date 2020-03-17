import App from "components/App"
import innerText from "components/Editor/helpers/innerText"
import React from "react"
import ReactDOM from "react-dom"

// import "material-colors.css"

import "stylesheets/colors.css" // Takes precedence
import "debug.css"
import "reset-input.css"
import "stylesheets/tailwind.generated.css"

// https://github.com/codex-src/codex-playwright
window.getCodex = (id = "editor") => {
	const node = document.getElementById(id)
	return innerText(node)
}

ReactDOM.render(<App />, document.getElementById("root"))
