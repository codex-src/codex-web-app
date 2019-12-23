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

// `count` counts the UTF-8 length of a string.
export function count(str) {
	return [...str].length
}
