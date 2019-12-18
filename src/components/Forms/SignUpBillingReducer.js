import months from "./helpers/months"
import useMethods from "use-methods"

const initialState = {
	chargeMonth: -1,
	nextMonth: {
		year:  "(loading…)",
		month: "(loading…)",
		day:   "(loading…)"
	},
	nextYear: {
		year:  "(loading…)",
		month: "(loading…)",
		day:   "(loading…)"
	},
	info: null,
	warn: null,
	fetching: false
}

const reducer = state => ({
	setNextMonth({ year, month, day }) {
		state.nextMonth = {
			year,
			month,
			day
		}
	},
	setNextYear({ year, month, day }) {
		state.nextYear = {
			year,
			month,
			day
		}
	},
	setChargeMonth() {
		if (state.chargeMonth === 1) {
			return
		}
		state.warn = null
		state.chargeMonth = 1
		state.info = `You will be charged $8 today and then on ${months[state.nextMonth.month]} ${state.nextMonth.day}.`
	},
	setChargeYear() {
		if (state.chargeMonth === 0) {
			return
		}
		state.warn = null
		state.chargeMonth = 0
		state.info = `You will be charged $80 today and then on ${months[state.nextYear.month]} ${state.nextYear.day}, ${state.nextYear.year}.`
	},
	setInfo(info) {
		state.info = info
	},
	setWarn(warn) {
		state.warn = warn
	},
	setFetching(fetching) {
		state.fetching = fetching
	}
})

const useReducer = () => useMethods(reducer, initialState)

export default useReducer
