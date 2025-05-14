"use strict";
const postmanToOpenApi = require("postman-to-openapi");
const postmanCollection = "./phindojo_collection.json";
const outputFile = "./openapi.yml";
async function convertCollection() {
    try {
        const result = await postmanToOpenApi(postmanCollection, outputFile, {
            defaultTag: "General",
        });
        console.log(`OpenAPI specs: ${result}`);
    }
    catch (err) {
        console.error("Conversion failed:", err);
    }
}
convertCollection();
