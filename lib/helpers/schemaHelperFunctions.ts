import * as fs from "fs/promises";
import { createSchema } from "genson-js";

export async function createJsonSchema(name: string, path: string, json: object) {
  const filePath = `./.api/${path}`;

  try {
    await fs.mkdir(filePath, { recursive: true });

    const schema = createSchema(json);
    const schemaString = JSON.stringify(schema, null, 2);
    const schemaName = `.api/${path}/${name}_schema.json`;

    await writeJsonFile(schemaName, schemaString);

    console.log("JSON Schema created and saved.");
  } catch (err) {
    console.error(err);
  }
}

async function writeJsonFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data);
  } catch (err) {
    console.error(err);
  }
}
