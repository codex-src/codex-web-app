// Maps user perceived language extensions to PrismJS
// language extensions.
const langMap = {}

function getPrismLang(lang) {
	if (!window.Prism || !lang || !langMap[lang]) {
		return null
	}
	return langMap[lang]
}

(function() {
	document.addEventListener("DOMContentLoaded", () => {
		try {
			/* eslint-disable no-multi-spaces */
			langMap.bash       = window.Prism && window.Prism.languages.bash
			langMap.c          = window.Prism && window.Prism.languages.c
			langMap.cpp        = window.Prism && window.Prism.languages.cpp
			langMap.css        = window.Prism && window.Prism.languages.css
			langMap.d          = window.Prism && window.Prism.languages.d
			langMap.diff       = window.Prism && window.Prism.languages.diff
			langMap.docker     = window.Prism && window.Prism.languages.docker
			langMap.dockerfile = window.Prism && window.Prism.languages.dockerfile
			langMap.git        = window.Prism && window.Prism.languages.git
			langMap.go         = window.Prism && window.Prism.languages.go
			langMap.gql        = window.Prism && window.Prism.languages.graphql // Added
			langMap.graphql    = window.Prism && window.Prism.languages.graphql
			langMap.htm        = window.Prism && window.Prism.languages.html    // Added
			langMap.html       = window.Prism && window.Prism.languages.html
			langMap.http       = window.Prism && window.Prism.languages.http
			langMap.js         = window.Prism && window.Prism.languages.jsx     // Uses jsx
			langMap.json       = window.Prism && window.Prism.languages.json
			// langMap.jsx     = window.Prism && window.Prism.languages["jsx"]
			langMap.kotlin     = window.Prism && window.Prism.languages.kotlin
			langMap.php        = window.Prism && window.Prism.languages.php
			langMap.py         = window.Prism && window.Prism.languages.py
			langMap.rb         = window.Prism && window.Prism.languages.rb
			langMap.ruby       = window.Prism && window.Prism.languages.ruby
			langMap.rust       = window.Prism && window.Prism.languages.rust
			langMap.sass       = window.Prism && window.Prism.languages.sass
			langMap.sh         = window.Prism && window.Prism.languages["shell-session"] // Uses shell-session
			langMap.shell      = window.Prism && window.Prism.languages["shell-session"] // Uses shell-session
			langMap.sql        = window.Prism && window.Prism.languages.sql
			langMap.svg        = window.Prism && window.Prism.languages.svg
			langMap.swift      = window.Prism && window.Prism.languages.swift
			langMap.ts         = window.Prism && window.Prism.languages.tsx     // Uses tsx
			// langMap.tsx     = window.Prism && window.Prism.languages["tsx"]
			langMap.wasm       = window.Prism && window.Prism.languages.wasm
			langMap.xml        = window.Prism && window.Prism.languages.xml
			langMap.yaml       = window.Prism && window.Prism.languages.yaml
			langMap.yml        = window.Prism && window.Prism.languages.yml
			/* eslint-enable no-multi-spaces */
		} catch (e) {
			console.warn(e)
		}
	})
})()

export default getPrismLang
