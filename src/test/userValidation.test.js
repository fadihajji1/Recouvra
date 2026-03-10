const { userValidation } = require("../utils/validators");

describe("User Validation", () => {
    describe("register", () => {
        test("should validate correct register data", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "agent",
            };
            const { error } = userValidation.register.validate(data, { abortEarly: false });
            expect(error).toBeUndefined();
        });

        test("should reject missing required fields", () => {
            const data = { email: "john@example.com" };
            const { error } = userValidation.register.validate(data, { abortEarly: false });
            expect(error).toBeDefined();
            expect(error.details.some((d) => d.path.includes("name"))).toBe(true);
            expect(error.details.some((d) => d.path.includes("password"))).toBe(true);
        });

        test("should reject invalid email", () => {
            const data = {
                name: "John",
                email: "invalid-email",
                password: "password123",
            };
            const { error } = userValidation.register.validate(data, { abortEarly: false });
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain("email");
        });

        test("should reject short password", () => {
            const data = {
                name: "John",
                email: "john@example.com",
                password: "123",
            };
            const { error } = userValidation.register.validate(data, { abortEarly: false });
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/password/);
        });
    });

    describe("login", () => {
        test("should validate correct login data", () => {
            const data = {
                email: "john@example.com",
                password: "password123",
            };
            const { error } = userValidation.login.validate(data, { abortEarly: false });
            expect(error).toBeUndefined();
        });

        test("should reject missing email or password", () => {
            const data = { email: "john@example.com" };
            const { error } = userValidation.login.validate(data, { abortEarly: false });
            expect(error).toBeDefined();
        });
    });
});