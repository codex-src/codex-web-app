// ^                            - start
//   \w(?:\.?\w+?)*             - alphanum
//   (?:\+(?:\w(?:\.?\w+?)*)?)* - (+(alphanum)?)*
//   @                          - @
//   \w(?:\.?\w+?)*             - alphanum
//   \.                         - .
//   \w(?:\.?\w+?)*             - alphanum
// $                            - end
//
// start alphanum (+(alphanum)?)* @ alphanum . alphanum end
const testEmailAddress = emailAddress => /^\w(?:\.?\w+?)*(?:\+(?:\w(?:\.?\w+?)*)?)*@\w(?:\.?\w+?)*\.\w(?:\.?\w+?)*$/.test(emailAddress)

export default testEmailAddress
