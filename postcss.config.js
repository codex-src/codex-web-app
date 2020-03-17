const purgecss = require("@fullhuman/postcss-purgecss")({
	content: [
		"./public/**/*.html",
		"./src/**/*.js",
	],
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
	// whitelistPatterns: [/^([a-z]+:)?grid-cols-\d+$/, /^([a-z]+:)?dark:.+$/],
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
