const { recoveryActionValidation } = require("../utils/validators");

describe("Recovery Action Validation", () => {
    describe("create", () => {
        test("should validate correct recovery action data", () => {
            const data = {
                invoice: "507f1f77bcf86cd799439011",
                actionType: "email",
                actionDate: new Date(),
                notes: "Action notes",
                nextActionDate: new Date(Date.now() + 86400000), // Tomorrow
            };
            const { error } = recoveryActionValidation.create.validate(data);
            expect(error).toBeUndefined();
        });

        test("should reject invalid action type", () => {
            const data = {
                invoice: "507f1f77bcf86cd799439011",
                actionType: "invalid_type",
                actionDate: new Date(),
            };
            const { error } = recoveryActionValidation.create.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain("actionType");
        });
    });
});