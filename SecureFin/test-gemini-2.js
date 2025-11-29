const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAnmlzNyQlbnTcV-wRNxWfWNVsfR-GgRWI");

async function run() {
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.0-pro", "gemini-pro"];

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`PASS: ${modelName}`);
            return;
        } catch (error) {
            console.log(`FAIL: ${modelName} (${error.status || '?'})`);
        }
    }
}

run();
