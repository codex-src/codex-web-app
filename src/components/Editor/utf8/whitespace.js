// $ perldoc perlrecharclass
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

export function isHorizontalWS(char) {
	// Optimization:
	const code = char.charCodeAt(0)
	if (code !== 9 && code !== 32 && code !== 160 && code < 5760) {
		return false
	}
	const ok = (
		char === "\u0009" || //     9
		char === "\u0020" || //    32
		char === "\u00a0" || //   160
		char === "\u1680" || //  5760
		char === "\u180e" || //  6158
		char === "\u2000" || //  8192
		char === "\u2001" || //  8193
		char === "\u2002" || //  8194
		char === "\u2003" || //  8195
		char === "\u2004" || //  8196
		char === "\u2005" || //  8197
		char === "\u2006" || //  8198
		char === "\u2007" || //  8199
		char === "\u2008" || //  8200
		char === "\u2009" || //  8201
		char === "\u200a" || //  8202
		char === "\u202f" || //  8239
		char === "\u205f" || //  8287
		char === "\u3000"    // 12288
	)
	return ok
}

export function isVerticalWS(char) {
	const ok = (
		char === "\u000a" || //    10
		char === "\u000b" || //    11
		char === "\u000c" || //    12
		char === "\u000d" || //    13
		char === "\u0085" || //   133
		char === "\u2028" || //  8232
		char === "\u2029"    //  8233
	)
	return ok
}

export function isHorizontalOrVerticalWS(char) {
	const ok = (
		isHorizontalWS(char) ||
		isVerticalWS(char)
	)
	return ok
}
