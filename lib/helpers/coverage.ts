import { request } from "@playwright/test";
import { execSync } from "child_process";
import "dotenv/config";
import * as fs from "fs";

const baseURL = process.env.URL;

/**
 *
 * @param endpoint url path for pulling the OpenAPI spec
 * @example getEndpointCoverage("auth"); console logs coverage for auth endpoints
 */
export async function getEndpointCoverage(endpoint: string) {
  console.log(`=== Coverage for ${endpoint} endpoints ===`);
  const response = await fetchOpenApi(endpoint);
  const coverageArray = getEndpoints(response);
  getCoverage(coverageArray);
}

/**
 *
 * @param resource
 * @returns JSON object of the OpenAPI spec
 *
 * @example await fetchOpenApi("messages"); returns JSON object of the OpenAPI spec
 *
 * There is also a ${resource}_spec3.json file created in the root of the project
 * These files are used to get the endpoints and calculate coverage
 *
 */
export async function fetchOpenApi(resource: string) {
  const requestContext = await request.newContext();
  const response = await requestContext.get(`${baseURL}v2/${resource}.json`, { timeout: 5000 });

  const body = await response.json();
  writeFile(`.spec3/${resource}_spec3.json`, JSON.stringify(body, null, 2));
  return body;
}

/**
 *
 * @param json JSON object of the OpenAPI spec
 * @returns Array of endpoints with format "VERB PATH"
 * @example getEndpoints(authJson); returns ["POST /auth/login", "POST /auth/logout", ...]
 *
 * This function is used to get the endpoints from the OpenAPI spec
 */
export function getEndpoints(json) {
  const spec3 = json;

  const methods = spec3.paths;

  const finalArray: string[] = [];
  for (const property in methods) {
    const verbs = Object.keys(methods[property]);
    for (const verb of verbs) {
      const finalVerb = verb.toUpperCase();
      const finalPath = property;
      finalArray.push(finalVerb + " " + finalPath);
    }
  }
  return finalArray;
}

//Greps local files getting a list of files with specified coverage tag and calculates coverage
export function getCoverage(coverageArray) {
  const totalEndPoints = coverageArray.length;
  let coveredEndPoints = 0;
  const nonCoveredEndpoints: string[] = [];

  //Iterates through the coverageArray to grep each file in the test directory looking for matches
  for (const value in coverageArray) {
    const output = execSync(`grep -rl tests -e 'COVERAGE_TAG: ${coverageArray[value]}$' | cat`, {
      encoding: "utf-8",
    });
    if (output != "") {
      coveredEndPoints += 1;
    } else {
      console.log(`Endpoint with no coverage: ${coverageArray[value]}`);
      nonCoveredEndpoints.push(coverageArray[value]);
    }
  }

  console.log("Total Endpoints: " + totalEndPoints);
  console.log("Covered Endpoints: " + coveredEndPoints);
  writeFile("./lib/non_covered_endpoints.json", JSON.stringify(nonCoveredEndpoints, null, "\t"));
  calculateCoverage(coveredEndPoints, totalEndPoints);
}

function calculateCoverage(coveredEndpoints: number, totalEndpoints: number) {
  const percentCovered = ((coveredEndpoints / totalEndpoints) * 100).toFixed(2);
  console.log("Coverage: " + percentCovered + "%");
  process.env.COVERED_ENDPOINTS = coveredEndpoints.toString();
  process.env.TOTAL_ENDPOINTS = totalEndpoints.toString();
  process.env.PERCENT_COVERED = percentCovered.toString();
}

// eslint-disable-next-line
function writeFile(location: string, data: string) {
  try {
    fs.writeFileSync(location, data);
    console.log("File written successfully");
    console.log("The written file has" + " the following contents:");
    console.log("" + fs.readFileSync(location));
  } catch (err) {
    console.error(err);
  }
}
