import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { Recipe } from '@prisma/client'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/db'
import Head from 'next/head'

type Query = {
  id: string
}

type Props = {
  recipe: Recipe
}

export default function BattlePage({ recipe }: Props) {
  const [hostname, setHostname] = useState('')
  const id = recipe.id
  const shareUrl = useMemo(() => {
    const text = recipe?.ingredients.replace(/\n/g, ',') + 'で作れるレシピは…？'
    const url = `https://${hostname}/recipe/${id}`
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(
      'AIレシピジェネレータ'
    )}`
  }, [id, hostname])

  useEffect(() => {
    if (typeof window !== undefined) {
      setHostname(location.hostname)
    }
  }, [typeof window])

  const ingredients = recipe.ingredients.replace(/\n/g, ',')
  const title = `${ingredients}で作れるレシピ | AIレシピジェネレータ`
  const description = `ChatGPTが考えた${ingredients}を使ったレシピです。`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
      </Head>
      <Container>
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
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query as Query

  const recipe = await prisma.recipe.findFirst({
    where: {
      id,
    },
  })

  if (!recipe) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
    },
  }
}
