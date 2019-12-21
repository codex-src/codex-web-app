export const date = `
	fragment date on Date {
		year
		month
		day
	}
`

export const user = `
	fragment user on User {
		userID
		createdAt
		updatedAt
		username
	}
`

export const noteShort = `
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
`

export const note = `
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
`
