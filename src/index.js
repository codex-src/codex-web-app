// import innerText from "components/Editor/helpers/innerText"
import App from "components/App"
import firebase from "firebase/app"
import React from "react"
import ReactDOM from "react-dom"

import "firebase/analytics"
import "firebase/auth"

import "debug.css"                          // Takes precedence
import "stylesheets/tailwind-variables.css" // Takes precedence
import "stylesheets/dark-mode-transition.css"

// Generated CSS:
import "stylesheets/tailwind.generated.css"

// // https://github.com/codex-src/codex-playwright
// window.getCodex = (id = "editor") => {
// 	const node = document.getElementById(id)
// 	return innerText(node)
// }

;(() => {
	firebase.initializeApp({
		apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
		databaseURL:       process.env.REACT_APP_FIREBASE_DATABASE_URL,
		projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
		storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
		appId:             process.env.REACT_APP_FIREBASE_APP_ID,
		measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
	})
	if (process.env.NODE_ENV === "production") {
		firebase.analytics()
	}
})()

ReactDOM.render(<App />, document.getElementById("root"))
