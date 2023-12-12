import { expect, test } from "@playwright/test";
import { PetStatus } from "../../enums";

test.describe("pet/ GET requests @pet", async () => {
  const values = Object.values(PetStatus);
  values.forEach((value) => {
    test(`GET pet summary with specific ~${value}~ status`, async ({ request }) => {
      const response = await request.get(`v2/pet/findByStatus?status=${value}`);

      expect(response.status()).toBe(200);
      const body = await response.json(); // eslint-disable-line

      // await createAssertions(body);
    });
  });
});
