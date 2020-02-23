import App from "components/App"
import innerText from "components/Editor/helpers/innerText"
import React from "react"
import ReactDOM from "react-dom"

// import "minireset.css"
// import "stylesheets/focus.css"

// NOTE: Needed for <Stylesheets />
import "material-colors.css"
import "debug.css"

import "stylesheets/tailwind.generated.css"
// import "stylesheets/reset-input.css"
// import "stylesheets/prism.css"

window.getCodex = (id = "editor") => {
	return innerText(document.getElementById(id))
}

ReactDOM.render(<App />, document.getElementById("root"))
