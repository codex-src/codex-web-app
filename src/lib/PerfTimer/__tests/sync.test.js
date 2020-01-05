import PerfTimer from "../PerfTimer"

test("1e3", () => {
	const perfTimer = new PerfTimer()
	perfTimer.on(() => {
		let index = 0
		while (index < 1e3) {
			index++
		}
	})
	const d = perfTimer.duration()
	expect(d >= 0 && d <= 1).toBe(true)
})

test("1e6", () => {
	const perfTimer = new PerfTimer()
	perfTimer.on(() => {
		let index = 0
		while (index < 1e6) {
			index++
		}
	})
	const d = perfTimer.duration()
	expect(d >= 0 && d <= 5).toBe(true)
})

test("1e9", () => {
	const perfTimer = new PerfTimer()
	perfTimer.on(() => {
		let index = 0
		while (index < 1e9) {
			index++
		}
	})
	const d = perfTimer.duration()
	expect(d >= 500 && d <= 1500).toBe(true)
})
