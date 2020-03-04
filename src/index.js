import App from "components/App"
import innerText from "components/Editor/helpers/innerText"
import React from "react"
import ReactDOM from "react-dom"

import "debug.css"
import "material-colors.css"
import "stylesheets/reset-input.css"
import "stylesheets/tailwind.generated.css"

// https://github.com/codex-src/codex-playwright
window.getCodex = (id = "editor") => {
	const node = document.getElementById(id)
	return innerText(node)
}

ReactDOM.render(<App />, document.getElementById("root"))
