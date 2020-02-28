// https://stackoverflow.com/a/39914235
function sleep(timeoutMs) {
	return new Promise(resolve => setTimeout(resolve, timeoutMs))
}

export default sleep
