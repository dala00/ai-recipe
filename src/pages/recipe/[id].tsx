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
import Link from 'next/link'
import { GetRecipeResponseData } from '@/types/response/recipe'

type Query = {
  id: string
}

export default function BattlePage() {
  const router = useRouter()
  const { id } = router.query as Query
  const [characterId, setCharacterId] = useState('')
  const [recipe, setRecipe] = useState<Recipe>()
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return ''
    }
    const url = `https://${location.hostname}/battle/${id}`
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&hashtags=${encodeURIComponent('AIバトラー')}`
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
      {id ? (
        <>
          <Heading textAlign="center" my={8}>
            この相手と対戦する！
          </Heading>
          <Box borderWidth={2} borderColor="gray.400" p={4} borderRadius={4}>
            <Box>
              攻撃力: {targetCharacter.power}
              <br />
              防御力: {targetCharacter.guard}
              <br />
              魔力: {targetCharacter.magicPower}
              <br />
              魔法防御力: {targetCharacter.magicGuard}
              <br />
              素早さ: {targetCharacter.speed}
            </Box>
            <Box mt={4} whiteSpace="pre-wrap" wordBreak="break-word">
              {targetCharacter.skill}
            </Box>
          </Box>
          <Box textAlign="center" mt={8}>
            {isSending ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <Button type="button" colorScheme="blue" onClick={() => battle()}>
                対戦する！
              </Button>
            )}
          </Box>
          {battleResult && (
            <Box>
              <Box textAlign="center">
                {/* https://gakujo.info/sozaishu/make */}
                <Image
                  src={
                    battleResult.isWin
                      ? '/images/kachi.png'
                      : '/images/make.png'
                  }
                  alt=""
                />
              </Box>
              <Text whiteSpace="pre-wrap" wordBreak="break-word">
                {battleResult.details}
              </Text>
              <Box mt={6} textAlign="center">
                <Link href="/battle">
                  <Button type="button" colorScheme="teal">
                    他の相手を探す
                  </Button>
                </Link>
              </Box>
              <Box mt={4} textAlign="center">
                <a href={shareUrl} target="_blank">
                  <Button type="button" colorScheme="twitter">
                    この対戦相手をTwitterでみんなに教える
                  </Button>
                </a>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Container>
  )
}
