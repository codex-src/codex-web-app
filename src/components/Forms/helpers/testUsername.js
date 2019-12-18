const testUsername = username => /^[a-zA-Z_]\w{2,19}$/.test(username)

export default testUsername
