import invariant from "invariant"
import React from "react"
import RenderDOM2 from "utils/RenderDOM2"
import syncViews from "../syncViews"

// -  -> -
//
// -  -> a
//
// a  -> -
//
// a  -> a
//
describe("group 1", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a1 -> a0 *Changed to a1
//
// a1 -> a1
//
// a1 -> a2
//
describe("group 2", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a1 -> b0
//
// a1 -> b1
//
// a1 -> b2
//
describe("group 3", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="b" memo={0} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="b" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="b" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// -  -> -
//
// -  -> a
//
// -  -> a
//    -> b
//
// -  -> a
//    -> b
//    -> c
//
describe("group 4", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// -  -> -
//
// a  -> -
//
// a  -> -
// b
//
// a  -> -
// b
// c
//
describe("group 4 (reversed)", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				{/* ... */}
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a  -> a
//       b
//       c
//
// b  -> a
//       b
//       c
//
// c  -> a
//       b
//       c
//
describe("group 5", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="b" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a  -> a
// b
// c
//
// a  -> b
// b
// c
//
// a  -> c
// b
// c
//
describe("group 5 (reversed)", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="b" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a  -> d
// b     e
// c     f
//
// d  -> a
// e     b
// f     c
//
describe("group 6", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="d" memo={1} />
				<div id="e" memo={1} />
				<div id="f" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="d" memo={1} />
				<div id="e" memo={1} />
				<div id="f" memo={1} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={1} />
				<div id="b" memo={1} />
				<div id="c" memo={1} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a0 -> x0
// b1    y1
// c2    z2
// x0    a0
// y1    b1
// z2    c2
//
// x0 -> a0
// y1    b1
// z2    c2
// a0    x0
// b1    y1
// c2    z2
//
describe("group 7", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={0} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
				<div id="x" memo={0} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="x" memo={0} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
				<div id="a" memo={0} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="x" memo={0} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
				<div id="a" memo={0} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={0} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
				<div id="x" memo={0} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})

// a0 -> x2
// b1    y1
// c2    z0 *Changed to z2
// x0    a2
// y1    b1
// z2    c0 *Changed to c2
//
// x2 -> a0 *Changed to a2
// y1    b1
// z0    c2
// a2    x0 *Changed to x2
// b1    y1
// c0    z2
//
describe("group 8", () => {
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="a" memo={0} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
				<div id="x" memo={0} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="x" memo={2} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
				<div id="a" memo={2} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
	test("", () => {
		const ClientDOM = props => (
			<div>
				<div id="x" memo={2} />
				<div id="y" memo={1} />
				<div id="z" memo={0} />
				<div id="a" memo={2} />
				<div id="b" memo={1} />
				<div id="c" memo={0} />
			</div>
		)
		const HiddenDOM = props => (
			<div>
				<div id="a" memo={2} />
				<div id="b" memo={1} />
				<div id="c" memo={2} />
				<div id="x" memo={2} />
				<div id="y" memo={1} />
				<div id="z" memo={2} />
			</div>
		)
		const clientDOM = RenderDOM2(<ClientDOM />)
		const hiddenDOM = RenderDOM2(<HiddenDOM />)
		syncViews(clientDOM, hiddenDOM, "memo"),
		expect(clientDOM.outerHTML).toBe(hiddenDOM.outerHTML)
	})
})
