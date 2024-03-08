const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
(async() => {
    const gptResponse = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 7
    })

    console.log(gptResponse.data)
  })()