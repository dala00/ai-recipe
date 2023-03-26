import Head from 'next/head'
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Recipe } from '@prisma/client'
import { GetRecipeResponseData } from '@/types/response/recipe'
import Link from 'next/link'

type Query = {
  id: string
}

export default function BattlePage() {
  const router = useRouter()
  const { id } = router.query as Query
  const [recipe, setRecipe] = useState<Recipe>()
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return ''
    }
    const text = recipe?.ingredients.replace(/\n/g, ',') + 'で作れるレシピは…？'
    const url = `https://${location.hostname}/recipe/${id}`
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(
      'AIレシピジェネレータ'
    )}`
  }, [id, typeof window])

  const initialize = useCallback(async () => {
    const response = await axios
      .get<GetRecipeResponseData>(`/api/recipe/${id}`)
      .catch((error) => {
        console.error(error)
        return null
      })
    if (!response) {
      router.push('/')
      return
    }

    setRecipe(response.data.recipe)
  }, [id])

  useEffect(() => {
    if (!id) {
      return
    }
    initialize()
  }, [id])

  return (
    <Container>
      {recipe ? (
        <>
          <Heading size="md">指定した食材</Heading>
          <Text mt={4} whiteSpace="pre-wrap" wordBreak="break-word">
            {recipe.ingredients}
          </Text>
          <Heading size="md" mt={8}>
            レシピ
          </Heading>
          <Text mt={4} whiteSpace="pre-wrap" wordBreak="break-word">
            {recipe.recipe}
          </Text>
          <Text mt={4} fontSize={12} color="gray.500">
            ※ AIが生成しているため正しくない情報の場合があります
          </Text>
          <Box mt={8} textAlign="center">
            <a href={shareUrl} target="_blank" rel="nofollow noopener">
              <Button type="button" colorScheme="twitter">
                このレシピをTwitterでシェア
              </Button>
            </a>
          </Box>
          <Center mt={8}>
            <Image src="/images/takuhai_yasai_box.png" alt="" maxHeight={40} />
          </Center>
          <Box mt={4} textAlign="center">
            <Link href="/">
              <Box textDecoration="underline">他の食材も試す</Box>
            </Link>
          </Box>
        </>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Container>
  )
}
