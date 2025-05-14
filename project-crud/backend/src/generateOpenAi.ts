import * as fs from "fs/promises";
import axios from "axios";
import { transpile } from "postman2openapi";
import * as dotenv from "dotenv";

dotenv.config();

interface PostmanResponse {
  collection: any;
}

const generateOpenAPI = async (): Promise<void> => {
  try {
    const url = `${process.env.POSTMAN_API_URL}?access_key=${process.env.POSTMAN_ACCESS_KEY}`;
    const response = await axios.get<PostmanResponse>(url);

    const openapi = transpile(response.data.collection);
    openapi.servers = [{ url: process.env.BASE_URL ?? "" }];

    await fs.writeFile("./swagger.json", JSON.stringify(openapi, null, 2));
    console.log("✅ OpenAPI JSON file has been updated successfully.");
  } catch (error: any) {
    console.error("❌ Failed to generate OpenAPI:", error.message);
    throw error;
  }
};

const run = async () => {
  try {
    await generateOpenAPI();
  } catch (error) {
    process.exit(1);
  }
};

run();

export { generateOpenAPI };
