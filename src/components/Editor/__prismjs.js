// // NOTE: Use React.memo because of PrismJS
// const CodeBlock = React.memo(({ reactKey, ...props }) => {
// 	let html = ""
// 	const lang = getPrismLang(props.lang)
// 	if (lang) {
// 		try {
// 			html = window.Prism.highlight(props.children, lang, props.lang)
// 		} catch (e) {
// 			console.warn(e)
// 		}
// 	}
// 	const className = `language-${props.lang}`
// 	return (
// 		<div style={{ ...stylex.parse("m-x:-24 p-x:24 b:white"), boxShadow: "0px 0px 1px hsl(var(--gray))" }}>
// 			<Markdown style={stylex.parse("c:gray")} start={`\`\`\`${props.lang}`} end="```">
// 				{!html ? (
// 					<code>
// 						{props.children}
// 					</code>
// 				) : (
// 					<code className={className} dangerouslySetInnerHTML={{
// 						__html: html,
// 					}} />
// 				)}
// 			</Markdown>
// 		</div>
// 	)
// })
