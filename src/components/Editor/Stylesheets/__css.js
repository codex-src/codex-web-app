// Returns a newline-delimited stylesheet.
//
// NOTE: Destructures an array because of css`...` syntax
function css([styleheet]) {
	return `${styleheet.trim()}\n`
}

export default css
