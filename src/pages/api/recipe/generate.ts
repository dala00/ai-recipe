import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import { ChatCompletionRequestMessageRoleEnum } from 'openai/dist/api'
import { prisma } from '@/lib/db'
import { GenerateRecipeRequestData } from '@/types/request/recipe'
import { GenerateRecipeResponseData } from '@/types/response/recipe'

export default async function battle(
  req: NextApiRequest,
  res: NextApiResponse<GenerateRecipeResponseData>
) {
  const { ingredients } = req.body as GenerateRecipeRequestData

  const fixedIngredients = ingredients
    .split(/\n/)
    .filter((row) => row.trim() !== '')
    .join('\n')

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  )
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: `いくつか食材を提示します。
食材の一部としてそれらの食材を全て使って作れる料理を教えて下さい。
また、作り方も教えて下さい。`,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: fixedIngredients,
      },
    ],
  })

  const result = response.data.choices[0]

  const recipe = await prisma.recipe.create({
    data: {
      ingredients: fixedIngredients,
      recipe: result.message?.content || '',
    },
  })

  res.status(200).json({ recipe })
}
