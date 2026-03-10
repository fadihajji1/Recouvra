const { invoiceValidation } = require("../utils/validators");

describe("Invoice Validation", () => {
    describe("create", () => {
        test("should validate correct invoice data", () => {
            const data = {
                invoiceNumber: "INV-001",
                client: "507f1f77bcf86cd799439011", // Valid ObjectId
                amount: 1000.5,
                issueDate: new Date("2023-01-01"),
                dueDate: new Date("2023-02-01"),
                description: "Invoice description",
            };
            const { error } = invoiceValidation.create.validate(data);
            expect(error).toBeUndefined();
        });

        test("should reject invalid client ObjectId", () => {
            const data = {
                invoiceNumber: "INV-001",
                client: "invalid-id",
                amount: 1000,
                dueDate: new Date(),
            };
            const { error } = invoiceValidation.create.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain("client");
        });

        test("should reject due date before issue date", () => {
            const data = {
                invoiceNumber: "INV-001",
                client: "507f1f77bcf86cd799439011",
                amount: 1000,
                issueDate: new Date("2023-02-01"),
                dueDate: new Date("2023-01-01"),
            };
            const { error } = invoiceValidation.create.validate(data);
            expect(error).toBeDefined();
        });
    });
});