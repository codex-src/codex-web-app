function partition(arr, start, end) {
	const pivot = arr[Math.floor((start + end) / 2)]
	while (start <= end) {
		while (arr[start] < pivot) {
			start++
		}
		while (arr[end] > pivot) {
			end--
		}
		if (start <= end) {
			;[arr[start], arr[end]] = [arr[end], arr[start]]
			start++
			end--
		}
	}
	return start
}

// `quickSort` quickly sorts an array; has a worst-case time
// complexity of `n^2` and best-case time complexity of
// `n * log(n)`.
//
// https://gist.github.com/claudiahdz/39a86084edaaabe7fc17c321c0bb6896
function quickSort(arr, start = 0, end = arr.length - 1) {
	if (arr.length < 2) {
		return arr
	}
	const index = partition(arr, start, end)
	if (start < index - 1) {
		quickSort(arr, start, index - 1)
	}
	if (index < end) {
		quickSort(arr, index, end)
	}
	return arr
}

export default quickSort
