import * as fs from "fs/promises";
import axios from "axios";
import { transpile } from "postman2openapi";
import * as dotenv from "dotenv";
dotenv.config();
const generateOpenAPI = async () => {
    try {
        const url = process.env.POSTMAN_API_URL;
        const response = await axios.get(url);
        console.log("Postman Collection Data:", response.data.collection);
        const openapi = transpile(response.data.collection);
        console.log("Generated OpenAPI:", JSON.stringify(openapi, null, 2));
        openapi.servers = [
            { url: process.env.BASE_URL ?? "http://localhost:5000" },
        ];
        await fs.writeFile("./swagger.json", JSON.stringify(openapi, null, 2));
        console.log("✅ OpenAPI JSON file has been updated successfully.");
    }
    catch (error) {
        console.error("❌ Failed to generate OpenAPI:", error.message);
        throw error;
    }
};
const run = async () => {
    try {
        await generateOpenAPI();
    }
    catch (error) {
        process.exit(1);
    }
};
run();
export { generateOpenAPI };
