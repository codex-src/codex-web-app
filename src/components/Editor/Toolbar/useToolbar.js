import useMethods from "use-methods"

const initialState = {
	undo:    false,
	redo:    false,
	cut:     false,
	copy:    false,
	paste:   false,
	type:    false,
	code:    false,
	preview: false,
	readme:  false,
}

const reducer = state => ({
	setProperty(propertyName, on) {
		state[propertyName] = on
	},
	toggleProperty(propertyName) {
		state[propertyName] = !state[propertyName]
	},
})

const useToolbar = () => useMethods(reducer, initialState)

export default useToolbar
