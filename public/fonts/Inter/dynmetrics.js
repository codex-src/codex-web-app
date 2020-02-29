// https://rsms.me/inter/dynmetrics
function calc(fontSizePx) {
	const a = -0.0223
	const b = 0.185
	const c = -0.1745
	return a + b * Math.E ** (c * fontSizePx)
}

const fontSizeRems = [
	0.75,
	0.875,
	0.9375,
	1,
	1.0625,
	1.125,
	1.25,
	1.375,
	1.5,
	1.6875,
	1.875,
	2.0625,
	2.25,
	2.625,
	3,
	3.5,
	4,
]

;(function() {
	for (const fontSizeRem of fontSizeRems) {
		const fontSizePx = fontSizeRem * 16
		console.log(`/* ${fontSizeRem}rem */ { letter-spacing: ${calc(fontSizePx).toFixed(4)}em; } /* ${fontSizePx}px */`)
	}
})()

// /* 0.75rem   */ { letter-spacing:  0.0005em; } /* 12px */
// /* 0.875rem  */ { letter-spacing: -0.0062em; } /* 14px */
// /* 0.9375rem */ { letter-spacing: -0.0088em; } /* 15px */
// /* 1rem      */ { letter-spacing: -0.0110em; } /* 16px */
// /* 1.0625rem */ { letter-spacing: -0.0128em; } /* 17px */
// /* 1.125rem  */ { letter-spacing: -0.0143em; } /* 18px */
// /* 1.25rem   */ { letter-spacing: -0.0167em; } /* 20px */
// /* 1.375rem  */ { letter-spacing: -0.0183em; } /* 22px */
// /* 1.5rem    */ { letter-spacing: -0.0195em; } /* 24px */
// /* 1.6875rem */ { letter-spacing: -0.0206em; } /* 27px */
// /* 1.875rem  */ { letter-spacing: -0.0213em; } /* 30px */
// /* 2.0625rem */ { letter-spacing: -0.0217em; } /* 33px */
// /* 2.25rem   */ { letter-spacing: -0.0220em; } /* 36px */
// /* 2.625rem  */ { letter-spacing: -0.0222em; } /* 42px */
// /* 3rem      */ { letter-spacing: -0.0223em; } /* 48px */
// /* 3.5rem    */ { letter-spacing: -0.0223em; } /* 56px */
// /* 4rem      */ { letter-spacing: -0.0223em; } /* 64px */
