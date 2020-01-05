import invariant from "invariant"

// A `PerfTimer` represents a performance timer, measured in
// milliseconds as per `Date.now()`.
//
// TODO (1): No-op in production.
// TODO (2): Add test suite for aggregate functions.
class PerfTimer {
	static minOf(...perfTimers) {
		invariant(
			perfTimers.length > 0,
			"PerfTimer: Aggregate function `PerfTimer.minOf(...)` expected one or more performance timers.",
		)
		let min = perfTimers[0].duration()
		for (const perfTimer of perfTimers) {
			if (perfTimer.duration() < min) {
				min = perfTimer.duration()
			}
		}
		return min
	}
	static maxOf(...perfTimers) {
		invariant(
			perfTimers.length > 0,
			"PerfTimer: Aggregate function `PerfTimer.maxOf(...)` expected one or more performance timers.",
		)
		let max = perfTimers[0].duration()
		for (const perfTimer of perfTimers) {
			if (perfTimer.duration() > max) {
				max = perfTimer.duration()
			}
		}
		return max
	}
	static avgOf(...perfTimers) {
		invariant(
			perfTimers.length > 0,
			"PerfTimer: Aggregate function `PerfTimer.avgOf(...)` expected one or more performance timers.",
		)
		let avg = 0
		for (const perfTimer of perfTimers) {
			avg += perfTimer.duration()
		}
		avg /= perfTimers.length
		return avg
	}
	static sumOf(...perfTimers) {
		invariant(
			perfTimers.length > 0,
			"PerfTimer: Aggregate function `PerfTimer.sumOf(...)` expected one or more performance timers.",
		)
		let sum = 0
		for (const perfTimer of perfTimers) {
			sum += perfTimer.duration()
		}
		return sum
	}
	constructor() {
		Object.assign(this, {
			_state: {
				t1: 0,
				t2: 0,
				result: -1,
			},
		})
	}
	// `reset` resets the timer.
	reset() {
		Object.assign(this, new this.constructor())
	}
	// `on` times the execution duration of a synchronous
	// function.
	on(timedFn) {
		this.restart()
		timedFn()
		this.stop()
	}
	// `asyncOn` synchronously times the execution duration of
	// an asynchronous function.
	async asyncOn(asyncTimedFn) {
		this.restart()
		await asyncTimedFn()
		this.stop()
	}
	// `restart` restarts the timer.
	restart() {
		this.reset()
		this.start()
	}
	// `start` starts the timer.
	start() {
		invariant(
			this._state.t1 === 0 && this._state.t2 === 0,
			"PerfTimer: A performance timer cannot be started more than once.",
		)
		this._state.t1 = Date.now()
	}
	// `stop` stops the timer.
	stop() {
		invariant(
			this._state.t1 !== 0 && this._state.t2 === 0,
			"PerfTimer: A performance timer cannot be stopped more than once.",
		)
		this._state.t2 = Date.now()
		this._state.result = this._state.t2 - this._state.t1
	}
	// `duration` returns the execution duration of the timer.
	duration() {
		invariant(
			this._state.result !== -1,
			"PerfTimer: A performance timer cannot be measured before code execution occurs. " +
			"You can use `perfTimer.on(timedFn)` to run the timer.",
		)
		return this._state.result
	}
}

export default PerfTimer
