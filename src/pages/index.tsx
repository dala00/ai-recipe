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
  Textarea,
} from '@chakra-ui/react'
import { FormEvent, useCallback, useState } from 'react'
import axios from 'axios'
import { GenerateRecipeResponseData } from '@/types/response/recipe'
import { GenerateRecipeRequestData } from '@/types/request/recipe'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState('')
  const [isSending, setIsSending] = useState(false)

  const create = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSending(true)

      const data: GenerateRecipeRequestData = {
        ingredients,
      }

      const response = await axios
        .post<GenerateRecipeResponseData>('/api/recipe/generate', data)
        .catch((error) => {
          console.error(error)
          return null
        })

      setIsSending(false)

      if (!response) {
        alert('エラーが発生しました。')
        return
      }

      router.push(`/repice/${response.data.recipe.id}`)
    },
    [ingredients]
  )

  return (
    <>
      <Container>
        <Text mt={4}>
          余った食材を入力してAIにレシピを提案してもらいましょう。
        </Text>
        <Center>
          <Image src="/images/takuhai_yasai_box.png" alt="" maxHeight={40} />
        </Center>
        <Box mt={4}>
          <form onSubmit={create}>
            <Box>食材を改行区切りで入力してください</Box>
            <Box>
              <Textarea
                value={ingredients}
                rows={8}
                placeholder={'じゃがいも\n人参\nカレールー'}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Box>
            <Box mt={4} textAlign="center">
              {isSending ? (
                <Spinner />
              ) : (
                <Button type="submit" colorScheme="blue">
                  レシピを生成する
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Container>
    </>
  )
}
