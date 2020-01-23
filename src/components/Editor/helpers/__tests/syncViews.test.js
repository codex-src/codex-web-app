import React from "react"
import renderDOM from "utils/renderDOM"
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
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
})

// a1 -> a0 -- changed to a1
//
// a1 -> a1
//
// a1 -> a2
//
describe("group 2", () => {
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="b" data-memo={0} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="b" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="b" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
})

// -  -> -
//
// -  -> a
//
// -  -> a
//       b
//
// -  -> a
//       b
//       c
//
describe("group 4", () => {
	test("", () => {
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="b" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="b" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="d" data-memo={1} />
				<div id="e" data-memo={1} />
				<div id="f" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="d" data-memo={1} />
				<div id="e" data-memo={1} />
				<div id="f" data-memo={1} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={1} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={1} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
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
		const Component1 = props => (
			<div>
				<div id="a" data-memo={0} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
				<div id="x" data-memo={0} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="x" data-memo={0} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
				<div id="a" data-memo={0} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="x" data-memo={0} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
				<div id="a" data-memo={0} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={0} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
				<div id="x" data-memo={0} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
})

// a0 -> x2
// b1    y1
// c2    z0 -- changed to z2
// x0    a2
// y1    b1
// z2    c0 -- changed to c2
//
// x2 -> a0 -- changed to a2
// y1    b1
// z0    c2
// a2    x0 -- changed to x2
// b1    y1
// c0    z2
//
describe("group 8", () => {
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="a" data-memo={0} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
				<div id="x" data-memo={0} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="x" data-memo={2} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
				<div id="a" data-memo={2} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<div id="x" data-memo={2} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={0} />
				<div id="a" data-memo={2} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={0} />
			</div>
		)
		const Component2 = props => (
			<div>
				<div id="a" data-memo={2} />
				<div id="b" data-memo={1} />
				<div id="c" data-memo={2} />
				<div id="x" data-memo={2} />
				<div id="y" data-memo={1} />
				<div id="z" data-memo={2} />
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		syncViews(rootNode1, rootNode2, "data-memo"),
		expect(rootNode1.outerHTML).toBe(rootNode2.outerHTML)
	})
})
