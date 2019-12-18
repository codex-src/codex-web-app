const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

const newDate = () => ({
	year:  "(loading…)",
	month: "(loading…)",
	day:   "(loading…)",
})

export const initialState = {
	chargeMonth: -1,
	nextMo:      newDate(),
	nextYr:      newDate(),
	info:        "",
	warn:        "",
	fetching:    false,
}

export const reducer = state => ({
	setNextMo(payload) {
		state.nextMo = { ...payload }
	},
	setNextYr(payload) {
		state.nextYr = { ...payload }
	},
	setChargeMo() {
		// if (state.chargeMonth === 1) {
		// 	return
		// }
		state.warn = ""
		state.chargeMonth = 1
		state.info = `You will be charged $8 today and then on ${months[state.nextMo.month]} ${state.nextMo.day}.`
	},
	setChargeYr() {
		// if (state.chargeMonth === 0) {
		// 	return
		// }
		state.warn = ""
		state.chargeMonth = 0
		state.info = `You will be charged $80 today and then on ${months[state.nextYr.month]} ${state.nextYr.day}, ${state.nextYr.year}.`
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
