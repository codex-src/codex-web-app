// `isSyntax` returns whether a character uses a markdown
// syntax character.
export function isSyntax(ch) {
	if (!ch) {
		return false
	}
	const ok = (
		ch === "#" ||
		ch === " " ||
		ch === "/" ||
		ch === ">" ||
		ch === "$" ||
		ch === "`" ||
		// ch === "\n" || // New.
		ch === "-" ||
		ch === "0" ||
		ch === "1" ||
		ch === "2" ||
		ch === "3" ||
		ch === "4" ||
		ch === "5" ||
		ch === "6" ||
		ch === "7" ||
		ch === "8" ||
		ch === "9" ||
		ch === "_" ||
		ch === "*" ||
		ch === "!" ||
		ch === "[" ||
		ch === "]" ||
		ch === "(" ||
		ch === ")"
	)
	return ok
}
