import {
	emailAddress,
	password,
	username,
} from "../test"

test("email address", () => {
	expect(emailAddress("")).toBe(false)
	expect(emailAddress("a")).toBe(false)
	expect(emailAddress("a@c")).toBe(false)
	expect(emailAddress("a@c.c")).toBe(true)
	expect(emailAddress("a@c.c.c")).toBe(true)
	expect(emailAddress("a.a@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b+b@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b+b+b@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b+b+b-d@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b+b+b-d-d@c.c.c")).toBe(true)
	expect(emailAddress("a.a.a+b+b+b-d-d-d@c.c.c")).toBe(true)
})

test("username", () => {
	expect(username("")).toBe(false)
	expect(username("username")).toBe(true)
	expect(username("username1")).toBe(true)
	expect(username("Username1")).toBe(true)
	expect(username("Username1!")).toBe(false)
	expect(username("u53rn4m31")).toBe(true)
	expect(username("u53rn4m31")).toBe(true)
	expect(username("U53rn4m31")).toBe(true)
	expect(username("U53rn4m31!")).toBe(false)
	expect(username("user.name")).toBe(false)
	expect(username("user.name1")).toBe(false)
	expect(username("User.name1")).toBe(false)
	expect(username("User.name1!")).toBe(false)
	expect(username("u53r.n4m31")).toBe(false)
	expect(username("u53r.n4m31")).toBe(false)
	expect(username("U53r.n4m31")).toBe(false)
	expect(username("U53r.n4m31!")).toBe(false)
})

test("password", () => {
	expect(password("")).toBe(false)
	expect(password("password")).toBe(false)
	expect(password("password1")).toBe(false)
	expect(password("Password1")).toBe(true)
	expect(password("Password1!")).toBe(true)
	expect(password("p455w0rd")).toBe(false)
	expect(password("p455w0rd1")).toBe(false)
	expect(password("P455w0rd1")).toBe(true)
	expect(password("P455w0rd1!")).toBe(true)
	expect(password("pass.word")).toBe(false)
	expect(password("pass.word1")).toBe(false)
	expect(password("Pass.word1")).toBe(true)
	expect(password("Pass.word1!")).toBe(true)
	expect(password("p455.w0rd")).toBe(false)
	expect(password("p455.w0rd1")).toBe(false)
	expect(password("P455.w0rd1")).toBe(true)
	expect(password("P455.w0rd1!")).toBe(true)
})
