const { paymentValidation } = require("../utils/validators");

describe("Payment Validation", () => {
    describe("create", () => {
        test("should validate correct payment data", () => {
            const data = {
                invoice: "507f1f77bcf86cd799439011",
                amount: 500.0,
                paymentDate: new Date(),
                paymentMethod: "bank_transfer",
                reference: "REF-001",
                notes: "Payment notes",
            };
            const { error } = paymentValidation.create.validate(data);
            expect(error).toBeUndefined();
        });

        test("should reject invalid payment method", () => {
            const data = {
                invoice: "507f1f77bcf86cd799439011",
                amount: 500,
                paymentMethod: "invalid_method",
            };
            const { error } = paymentValidation.create.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain("paymentMethod");
        });
    });
});