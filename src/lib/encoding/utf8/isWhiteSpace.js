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

// `isHWhiteSpace` returns whether a character is a UTF-8
// encoded Unicode horizontal white space character.
export function isHWhiteSpace(ch) {
	if (!ch) {
		return false
	}
	// Fast pass:
	const codePoint = ch.codePointAt(0)
	if ((codePoint > 0x0020 && codePoint < 0x00a0) ||
			(codePoint > 0x00a0 && codePoint < 0x1680)) {
		return false
	}
	const ok = (
		ch === "\u0009" || //      9
		ch === "\u0020" || //     32 *Fast pass
		ch === "\u00a0" || //    160 *Fast pass
		ch === "\u1680" || //  5,760 *Fast pass
		ch === "\u180e" || //  6,158
		ch === "\u2000" || //  8,192
		ch === "\u2001" || //  8,193
		ch === "\u2002" || //  8,194
		ch === "\u2003" || //  8,195
		ch === "\u2004" || //  8,196
		ch === "\u2005" || //  8,197
		ch === "\u2006" || //  8,198
		ch === "\u2007" || //  8,199
		ch === "\u2008" || //  8,200
		ch === "\u2009" || //  8,201
		ch === "\u200a" || //  8,202
		ch === "\u202f" || //  8,239
		ch === "\u205f" || //  8,287
		ch === "\u3000"    // 12,288
	)
	return ok
}

// `isVWhiteSpace` returns whether a character is a UTF-8
// encoded Unicode vertical white space character.
export function isVWhiteSpace(ch) {
	if (!ch) {
		return false
	}
	// Fast pass:
	const codePoint = ch.codePointAt(0)
	if ((codePoint > 0x000d && codePoint < 0x0085) ||
			(codePoint > 0x0085 && codePoint < 0x2028)) {
		return false
	}
	const ok = (
		ch === "\u000a" || //    10
		ch === "\u000b" || //    11
		ch === "\u000c" || //    12
		ch === "\u000d" || //    13 *Fast pass
		ch === "\u0085" || //   133 *Fast pass
		ch === "\u2028" || // 8,232 *Fast pass
		ch === "\u2029"    // 8,233
	)
	return ok
}

// `isWhiteSpace` returns whether a character is a UTF-8
// encoded Unicode white space character.
export function isWhiteSpace(ch) {
	if (!ch) {
		return false
	}
	const ok = (
		isHWhiteSpace(ch) ||
		isVWhiteSpace(ch)
	)
	return ok
}
