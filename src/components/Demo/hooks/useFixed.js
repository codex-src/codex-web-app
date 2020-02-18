import React from "react"

function useScrollY() {
	const [scrollY, setScrollY] = React.useState(0)
	useEffect(() => {
		const h = e => {
			if (window.getComputedStyle(document.body).position !== "fixed") {
				setScrollY(window.scrollY)
			}
		}
		window.addEventListener("scroll", h)
		return () => {
			window.removeEventListener("scroll", h)
		}
	}, [])
	return scrollY
}

function useFixed(initialValue) {
	const scrollY = useScrollY()
	const [fixed, setFixed] = React.useState(initialValue)
	useEffect(() => {
		if (fixed) {
			document.body.style.position = "fixed"
			document.body.style.left = 0
			document.body.style.right = 0
			document.body.style.top = `${-scrollY}px`
		} else {
			document.body.style.position = ""
			document.body.style.left = ""
			document.body.style.right = ""
			document.body.style.top = ""
			if (!document.body.style.length) {
				document.body.removeAttribute("style")
			}
			window.scrollTo(0, scrollY)
		}
	}, [scrollY, fixed])
	return [fixed, setFixedf]
}

export default useFixed
