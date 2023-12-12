import { getEndpointCoverage } from "@helpers/coverage";
import { test as coverage } from "@playwright/test";

coverage("calculate coverage", async () => {
  await getEndpointCoverage("swagger");
});
