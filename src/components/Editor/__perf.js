// import PerfTimer from "lib/PerfTimer"
//
// const perfParser        = new PerfTimer() // eslint-disable-line
// const perfReactRenderer = new PerfTimer() // eslint-disable-line
// const perfDOMRenderer   = new PerfTimer() // eslint-disable-line
// const perfDOMCursor     = new PerfTimer() // eslint-disable-line
//
// // `newFPSStyleString` returns a new frames per second CSS
// // inline-style string.
// function newFPSStyleString(ms) {
// 	if (ms < 16.67) {
// 		return "color: lightgreen;"
// 	} else if (ms < 33.33) {
// 		return "color: orange;"
// 	}
// 	return "color: red;"
// }
//
// const p = perfParser.duration()
// const r = perfReactRenderer.duration()
// const d = perfDOMRenderer.duration()
// const c = perfDOMCursor.duration()
// const sum = p + r + d + c
// console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${sum})`, newFPSStyleString(sum))
