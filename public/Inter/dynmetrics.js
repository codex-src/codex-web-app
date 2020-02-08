// https://rsms.me/inter/dynmetrics
// https://github.com/rsms/inter/blob/a4d3c0c2351a81313ff776301ec6c838217cc154/docs/res/base.js#L82
function calc(fontSize) {
	const a = -0.0223
	const b = 0.185
	const c = -0.1745
	return a + b * Math.E ** (c * fontSize)
}

;(function() {
	for (let index = 0; index < 64; index++) {
		const em = index / 16
		console.log(`/* <font-size: ${index}px or ${em}em> */ { letter-spacing: ${calc(index).toFixed(4)}em; }`)
	}
})()

// /* <font-size:  0px or 0.0000em> */ { letter-spacing:  0.1627em; }
// /* <font-size:  1px or 0.0625em> */ { letter-spacing:  0.1331em; }
// /* <font-size:  2px or 0.1250em> */ { letter-spacing:  0.1082em; }
// /* <font-size:  3px or 0.1875em> */ { letter-spacing:  0.0873em; }
// /* <font-size:  4px or 0.2500em> */ { letter-spacing:  0.0698em; }
// /* <font-size:  5px or 0.3125em> */ { letter-spacing:  0.0550em; }
// /* <font-size:  6px or 0.3750em> */ { letter-spacing:  0.0426em; }
// /* <font-size:  7px or 0.4375em> */ { letter-spacing:  0.0322em; }
// /* <font-size:  8px or 0.5000em> */ { letter-spacing:  0.0235em; }
// /* <font-size:  9px or 0.5625em> */ { letter-spacing:  0.0162em; }
// /* <font-size: 10px or 0.6250em> */ { letter-spacing:  0.0100em; }
// /* <font-size: 11px or 0.6875em> */ { letter-spacing:  0.0048em; }
// /* <font-size: 12px or 0.7500em> */ { letter-spacing:  0.0005em; }
// /* <font-size: 13px or 0.8125em> */ { letter-spacing: -0.0032em; }
// /* <font-size: 14px or 0.8750em> */ { letter-spacing: -0.0062em; }
// /* <font-size: 15px or 0.9375em> */ { letter-spacing: -0.0088em; }
// /* <font-size: 16px or 1.0000em> */ { letter-spacing: -0.0110em; }
// /* <font-size: 17px or 1.0625em> */ { letter-spacing: -0.0128em; }
// /* <font-size: 18px or 1.1250em> */ { letter-spacing: -0.0143em; }
// /* <font-size: 19px or 1.1875em> */ { letter-spacing: -0.0156em; }
// /* <font-size: 20px or 1.2500em> */ { letter-spacing: -0.0167em; }
// /* <font-size: 21px or 1.3125em> */ { letter-spacing: -0.0176em; }
// /* <font-size: 22px or 1.3750em> */ { letter-spacing: -0.0183em; }
// /* <font-size: 23px or 1.4375em> */ { letter-spacing: -0.0190em; }
// /* <font-size: 24px or 1.5000em> */ { letter-spacing: -0.0195em; }
// /* <font-size: 25px or 1.5625em> */ { letter-spacing: -0.0199em; }
// /* <font-size: 26px or 1.6250em> */ { letter-spacing: -0.0203em; }
// /* <font-size: 27px or 1.6875em> */ { letter-spacing: -0.0206em; }
// /* <font-size: 28px or 1.7500em> */ { letter-spacing: -0.0209em; }
// /* <font-size: 29px or 1.8125em> */ { letter-spacing: -0.0211em; }
// /* <font-size: 30px or 1.8750em> */ { letter-spacing: -0.0213em; }
// /* <font-size: 31px or 1.9375em> */ { letter-spacing: -0.0215em; }
// /* <font-size: 32px or 2.0000em> */ { letter-spacing: -0.0216em; }
// /* <font-size: 33px or 2.0625em> */ { letter-spacing: -0.0217em; }
// /* <font-size: 34px or 2.1250em> */ { letter-spacing: -0.0218em; }
// /* <font-size: 35px or 2.1875em> */ { letter-spacing: -0.0219em; }
// /* <font-size: 36px or 2.2500em> */ { letter-spacing: -0.0220em; }
// /* <font-size: 37px or 2.3125em> */ { letter-spacing: -0.0220em; }
// /* <font-size: 38px or 2.3750em> */ { letter-spacing: -0.0221em; }
// /* <font-size: 39px or 2.4375em> */ { letter-spacing: -0.0221em; }
// /* <font-size: 40px or 2.5000em> */ { letter-spacing: -0.0221em; }
// /* <font-size: 41px or 2.5625em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 42px or 2.6250em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 43px or 2.6875em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 44px or 2.7500em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 45px or 2.8125em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 46px or 2.8750em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 47px or 2.9375em> */ { letter-spacing: -0.0222em; }
// /* <font-size: 48px or 3.0000em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 49px or 3.0625em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 50px or 3.1250em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 51px or 3.1875em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 52px or 3.2500em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 53px or 3.3125em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 54px or 3.3750em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 55px or 3.4375em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 56px or 3.5000em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 57px or 3.5625em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 58px or 3.6250em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 59px or 3.6875em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 60px or 3.7500em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 61px or 3.8125em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 62px or 3.8750em> */ { letter-spacing: -0.0223em; }
// /* <font-size: 63px or 3.9375em> */ { letter-spacing: -0.0223em; }
