import PerfTimer from "../PerfTimer"

// https://stackoverflow.com/a/39914235
function sleep(forMs) {
	return new Promise(resolve => setTimeout(resolve, forMs))
}

// Asynchronous code execution delay:
const delay = 10

test("0e0", async () => {
	const perfTimer = new PerfTimer()
	await perfTimer.asyncOn(async () => {
		await sleep(0e0)
	})
	const d = perfTimer.duration()
	expect(d < 0e0 + delay).toBe(true)
})

test("1e0", async () => {
	const perfTimer = new PerfTimer()
	await perfTimer.asyncOn(async () => {
		await sleep(1e0)
	})
	const d = perfTimer.duration()
	expect(d < 1e0 + delay).toBe(true)
})

test("1e1", async () => {
	const perfTimer = new PerfTimer()
	await perfTimer.asyncOn(async () => {
		await sleep(1e1)
	})
	const d = perfTimer.duration()
	expect(d < 1e1 + delay).toBe(true)
})

test("1e2", async () => {
	const perfTimer = new PerfTimer()
	await perfTimer.asyncOn(async () => {
		await sleep(1e2)
	})
	const d = perfTimer.duration()
	expect(d < 1e2 + delay).toBe(true)
})

test("1e3", async () => {
	const perfTimer = new PerfTimer()
	await perfTimer.asyncOn(async () => {
		await sleep(1e3)
	})
	const d = perfTimer.duration()
	expect(d < 1e3 + delay).toBe(true)
})
