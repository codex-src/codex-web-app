const months = {
	0:  "January",
	1:  "February",
	2:  "March",
	3:  "April",
	4:  "May",
	5:  "June",
	6:  "July",
	7:  "August",
	8:  "September",
	9:  "October",
	10: "November",
	11: "December",
}

export const initialState = {
	chargeMonth: -1,
	nextMo: {
		year:  "(loading…)",
		month: "(loading…)",
		day:   "(loading…)",
	},
	nextYr: {
		year:  "(loading…)",
		month: "(loading…)",
		day:   "(loading…)",
	},
	info:     "",
	warn:     "",
	fetching: false,
}

export const reducer = state => ({
	setNextMo(payload) {
		state.nextMo = { ...payload }
	},
	setNextYr(payload) {
		state.nextYr = { ...payload }
	},
	setChargeMonth() {
		// FIXME?
		// if (state.chargeMonth === 1) {
		// 	return
		// }
		state.warn = ""
		state.chargeMonth = 1
		state.info = `You will be charged $8 today and then on ${months[state.nextMo.month]} ${state.nextMo.day}.`
	},
	setChargeYear() {
		// FIXME?
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
