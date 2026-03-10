const { clientValidation } = require("../utils/validators");

describe("Client Validation", () => {
    describe("create", () => {
        test("should validate correct client data", () => {
            const data = {
                name: "Client Name",
                email: "client@example.com",
                phone: "+1234567890",
                address: {
                    street: "123 Main St",
                    city: "City",
                    postalCode: "12345",
                    country: "Country",
                },
                company: "Company Inc",
                siret: "12345678901234",
            };
            const { error } = clientValidation.create.validate(data);
            expect(error).toBeUndefined();
        });

        test("should reject invalid phone number", () => {
            const data = {
                name: "Client",
                email: "client@example.com",
                phone: "invalid-phone",
            };
            const { error } = clientValidation.create.validate(data);
            expect(error).toBeDefined();
            expect(error.details[0].path).toContain("phone");
        });
    });
});