import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai' // ✅ For Hugging Face’s OpenAI-compatible router

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`

// 🔒 Anthropic setup (leave as is for when you have credits)
// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   dangerouslyAllowBrowser: true,
// })

// export async function getRecipeFromChefClaude(ingredientsArr) {
//   const ingredientsString = ingredientsArr.join(', ')

//   const msg = await anthropic.messages.create({
//     model: 'claude-3-haiku-20240307',
//     max_tokens: 1024,
//     system: SYSTEM_PROMPT,
//     messages: [
//       {
//         role: 'user',
//         content:
//           "I have ${ingredientsString}. Please give me a recipe you'd recommend I make!",
//       },
//     ],
//   })

//   return msg.content[0].text
// }

// ✅ Hugging Face + Kimi-K2 setup using OpenAI-compatible client
const hfClient = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: import.meta.env.VITE_API_KEY, // same variable name you already use
  dangerouslyAllowBrowser: true, // Scrimba-safe (remove in production)
})

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(', ')

  try {
    const completion = await hfClient.chat.completions.create({
      model: 'moonshotai/Kimi-K2-Thinking:novita',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    })

    return completion.choices[0].message.content
  } catch (err) {
    console.error('Error fetching from Kimi-K2:', err)
    return "Sorry, I couldn't fetch a recipe right now."
  }
}
