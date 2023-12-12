import { expect, test } from "@playwright/test";

test(`GET pet summary with specific pet id 2!`, async ({ request }) => {
    const response = await request.get(`v2/pet/2`);

    expect(response.status()).toBe(200);
    const body = await response.json();
});