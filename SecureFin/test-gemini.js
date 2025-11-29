const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAnmlzNyQlbnTcV-wRNxWfWNVsfR-GgRWI");

async function run() {
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

    for (const modelName of models) {
        console.log(`Testing model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text();
            console.log(`SUCCESS: ${modelName} responded: ${text}`);
            return; // Stop after first success
        } catch (error) {
            console.error(`FAILED: ${modelName} - ${error.message}`);
        }
    }
}

run();
