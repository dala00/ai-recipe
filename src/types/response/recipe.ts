import { Recipe } from '@prisma/client'

export type GenerateRecipeResponseData = {
  recipe: Recipe
}

export type GetRecipeResponseData = {
  recipe: Recipe
}
