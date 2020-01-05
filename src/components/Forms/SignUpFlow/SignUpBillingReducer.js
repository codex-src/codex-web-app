import time from "lib/time"
import useMethods from "use-methods"

const initialState = {
	chargeMonth: -1,
	nextMonth:   { year: "(loading…)", month: "(loading…)", day: "(loading…)" },
	nextYear:    { year: "(loading…)", month: "(loading…)", day: "(loading…)" },
	info:        "",
	warn:        "",
	fetching:    false,
}

const reducer = state => ({
	setNextMonth(year, month, day) {
		state.nextMonth = {
			year,  // The next month’s year.
			month, // The next month’s month.
			day,   // The next month’s dayy.
		}
	},
	setNextYear(year, month, day) {
		state.nextYear = {
			year,  // The next year’s year.
			month, // The next year’s month.
			day,   // The next year’s day.
		}
	},
	setChargeMonth() {
		state.warn = ""
		state.chargeMonth = 1
		const { year, month, day } = state.nextMonth
		state.info = `You will be charged $8 today and then on ${time.formatDate(year, month, day, false)}.`
	},
	setChargeYear() {
		state.warn = ""
		state.chargeMonth = 0
		const { year, month, day } = state.nextYear
		state.info = `You will be charged $80 today and then on ${time.formatDate(year, month, day, true)}.`
	},
	setInfo(info) {
		state.info = info
	},
	setWarn(warn) {
		state.warn = warn
	},
	setFetching(fetching) {
		state.fetching = fetching
	},
})

const useSignUpBilling = () => useMethods(reducer, initialState)

export default useSignUpBilling
