const exports = {

	date: `
		fragment date on Date {
			year
			month
			day
		}
	`,

	user: `
		fragment user on User {
			userID
			createdAt
			updatedAt
			username
		}
	`,

	noteShort: `
		fragment noteShort on Note {
			# userID
			noteID
			createdAt
			updatedAt
			titleUTF8Count
			title
			# dataUTF8Count
			data280
			# data
		}
	`,

	note: `
		fragment note on Note {
			userID
			noteID
			createdAt
			updatedAt
			titleUTF8Count
			title
			dataUTF8Count
			data280
			data
		}
	`,

}

export default exports
