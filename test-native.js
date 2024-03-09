const fetch = require('node-fetch'); // Only necessary if you're using Node.js

async function main() {
    const apiKey = "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"; // Use an environment variable in production
    const url = "https://api.openai.com/v1/chat/completions"; // Adjust if the API version changes
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    };
    const body = JSON.stringify({
        model: "gpt-4-0125-preview", // Update this to your model of choice
        messages: [
            // Example chat history
            {
                role: "user",
                content: "What's the weather like today?"
            },
            {
                role: "assistant",
                content: "The weather is sunny and warm today."
            },
            // System message setting the assistant's role
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            // Your new user input goes here
            // For example, if you want to continue the conversation based on the chat history
            {
                role: "user",
                content: "Thanks! Do I need an umbrella?"
            }
        ]
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.body}`);
        }

        const data = await response.json();
        console.log(data.choices[0]);
    } catch (error) {
        console.error("Error making the API request:", error.message);
    }
}

main();
