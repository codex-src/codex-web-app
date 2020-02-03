// $ perldoc perlrecharclass
//
// ...
//
// The following table is a complete listing of characters matched by
// "\s", "\h" and "\v" as of Unicode 6.0.
//
// The first column gives the Unicode code point of the character (in hex
// format), the second column gives the (Unicode) name. The third column
// indicates by which class(es) the character is matched (assuming no
// locale is in effect that changes the "\s" matching).
//
// 0x0009        CHARACTER TABULATION   h s
// 0x000a              LINE FEED (LF)    vs
// 0x000b             LINE TABULATION    vs
// 0x000c              FORM FEED (FF)    vs
// 0x000d        CARRIAGE RETURN (CR)    vs
// 0x0020                       SPACE   h s
// 0x0085             NEXT LINE (NEL)    vs
// 0x00a0              NO-BREAK SPACE   h s
// 0x1680            OGHAM SPACE MARK   h s
// 0x180e   MONGOLIAN VOWEL SEPARATOR   h s
// 0x2000                     EN QUAD   h s
// 0x2001                     EM QUAD   h s
// 0x2002                    EN SPACE   h s
// 0x2003                    EM SPACE   h s
// 0x2004          THREE-PER-EM SPACE   h s
// 0x2005           FOUR-PER-EM SPACE   h s
// 0x2006            SIX-PER-EM SPACE   h s
// 0x2007                FIGURE SPACE   h s
// 0x2008           PUNCTUATION SPACE   h s
// 0x2009                  THIN SPACE   h s
// 0x200a                  HAIR SPACE   h s
// 0x2028              LINE SEPARATOR    vs
// 0x2029         PARAGRAPH SEPARATOR    vs
// 0x202f       NARROW NO-BREAK SPACE   h s
// 0x205f   MEDIUM MATHEMATICAL SPACE   h s
// 0x3000           IDEOGRAPHIC SPACE   h s

// Returns whether a rune is a horizontal white space rune.
export function isHWhiteSpace(rune) {
	if (!rune) {
		return false
	}
	// // Fast pass:
	// const codePoint = rune.codePointAt(0)
	// if ((codePoint > 0x0020 && codePoint < 0x00A0) ||
	// 		(codePoint > 0x00A0 && codePoint < 0x1680)) {
	// 	return false
	// }
	const ok = (
		rune === "\u0009" || //      9
		rune === "\u0020" || //     32 *Fast pass
		rune === "\u00A0" || //    160 *Fast pass
		rune === "\u1680" || //  5,760 *Fast pass
		rune === "\u180E" || //  6,158
		rune === "\u2000" || //  8,192
		rune === "\u2001" || //  8,193
		rune === "\u2002" || //  8,194
		rune === "\u2003" || //  8,195
		rune === "\u2004" || //  8,196
		rune === "\u2005" || //  8,197
		rune === "\u2006" || //  8,198
		rune === "\u2007" || //  8,199
		rune === "\u2008" || //  8,200
		rune === "\u2009" || //  8,201
		rune === "\u200A" || //  8,202
		rune === "\u202F" || //  8,239
		rune === "\u205F" || //  8,287
		rune === "\u3000"    // 12,288
	)
	return ok
}

// Returns whether a rune is a vertical white space rune.
export function isVWhiteSpace(rune) {
	if (!rune) {
		return false
	}
	// // Fast pass:
	// const codePoint = rune.codePointAt(0)
	// if ((codePoint > 0x000D && codePoint < 0x0085) ||
	// 		(codePoint > 0x0085 && codePoint < 0x2028)) {
	// 	return false
	// }
	const ok = (
		rune === "\u000A" || //    10
		rune === "\u000B" || //    11
		rune === "\u000C" || //    12
		rune === "\u000D" || //    13 *Fast pass
		rune === "\u0085" || //   133 *Fast pass
		rune === "\u2028" || // 8,232 *Fast pass
		rune === "\u2029"    // 8,233
	)
	return ok
}

// Returns whether a rune is a horizontal or vertical white
// space rune.
export function isWhiteSpace(rune) {
	if (!rune) {
		return false
	}
	const ok = (
		isHWhiteSpace(rune) ||
		isVWhiteSpace(rune)
	)
	return ok
}
