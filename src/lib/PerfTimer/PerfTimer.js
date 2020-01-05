import invariant from "invariant"

// A `PerfTimer` represents a performance timer, measured in
// milliseconds as per `Date.now()`.
//
// TODO (1): No-op in production -- how to?
// TODO (2): Add test case for `durations`.
class PerfTimer {
	static durations(...perfTimers) {
		// return perfTimers.reduce((sum, each) => sum + each.duration(), 0)
		let sum = 0
		perfTimers.map(each => sum += each.duration())
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
			this._state.t1 === 0 &&
			this._state.t2 === 0,
			"PerfTimer: A performance timer cannot be started more than once.",
		)
		this._state.t1 = Date.now()
	}
	// `stop` stops the timer.
	stop() {
		invariant(
			this._state.t1 !== 0 && // Must be non-zero.
			this._state.t2 === 0,
			"PerfTimer: A performance timer cannot be stopped more than once.",
		)
		this._state.t2 = Date.now()
		this._state.result = this._state.t2 - this._state.t1
	}
	// `duration` returns the execution duration of the timer.
	duration() {
		invariant(
			this._state.result !== -1,
			"PerfTimer: Cannot measure the duration of an unstarted or unstopped performance timer. " +
			"You can use `perfTimer.on(timedFn)` to start and stop the timer.",
		)
		return this._state.result
	}
}

export default PerfTimer
