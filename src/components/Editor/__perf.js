import PerfTimer from "lib/PerfTimer"

export const perfParser        = new PerfTimer() // eslint-disable-line
export const perfReactRenderer = new PerfTimer() // eslint-disable-line
export const perfDOMRenderer   = new PerfTimer() // eslint-disable-line
export const perfDOMCursor     = new PerfTimer() // eslint-disable-line

// `newFPSStyleString` returns a new frames per second CSS
// inline-style string.
export function newFPSStyleString(ms) {
	if (ms < 16.67) {
		return "color: lightgreen;"
	} else if (ms < 33.33) {
		return "color: orange;"
	}
	return "color: red;"
}
