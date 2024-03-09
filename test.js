// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: "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",
// });
// const openai = new OpenAIApi(configuration);
// (async() => {
//     const gptResponse = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: "Say this is a test",
//     temperature: 0,
//     max_tokens: 7
//     })

//     console.log(gptResponse.data)
//   })()
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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" // This is also the default, can be omitted
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-4-0125-preview",
  });

  console.log(completion.choices[0]);
}

main();