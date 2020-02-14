// https://tailwindcss.com/docs/controlling-file-size/#setting-up-purgecss
// https://github.com/danestves/danestves/blob/master/postcss.config.js
const purgecss = require("@fullhuman/postcss-purgecss")({
	content: ["./src/**/*.{js}"],
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
})

module.exports = {
	plugins: [
		require("tailwindcss"),
		require("autoprefixer"),
		...process.env.NODE_ENV === "production"
			? [purgecss]
			: [],
	],
}
