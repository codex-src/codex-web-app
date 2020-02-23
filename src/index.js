import App from "components/App"
import innerText from "components/Editor/helpers/innerText"
import React from "react"
import ReactDOM from "react-dom"

import "material-colors.css"
import "debug.css"
import "stylesheets/tailwind.generated.css"

// codex-playwright
window.getCodex = (id = "editor") => {
	const node = document.getElementById(id)
	return innerText(node)
}

ReactDOM.render(<App />, document.getElementById("root"))
