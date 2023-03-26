import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'
import { GetRecipeResponseData } from '@/types/response/recipe'

type Query = {
  id: string
}

export default async function battle(
  req: NextApiRequest,
  res: NextApiResponse<GetRecipeResponseData>
) {
  const { id } = req.body as Query

  const recipe = await prisma.recipe.findFirst({
    where: {
      id,
    },
  })

  if (!recipe) {
    res.status(404).end('Not found')
    return
  }

  res.status(200).json({ recipe })
}
