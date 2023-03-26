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
import { GetCharacterResponseData } from '@/types/response/character'
import { useRouter } from 'next/router'
import { Character } from '@prisma/client'
import { BattleResponseData } from '@/types/response/recipe'
import Link from 'next/link'

const characterIdKey = 'characterId'

type Query = {
  targetCharacterId: string
}

export default function BattlePage() {
  const router = useRouter()
  const { targetCharacterId } = router.query as Query
  const [characterId, setCharacterId] = useState('')
  const [character, setCharacter] = useState<Character>()
  const [targetCharacter, setTargetCharacter] = useState<Character>()
  const [battleResult, setBattleResult] = useState<BattleResponseData>()
  const [isSending, setIsSending] = useState(false)
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return ''
    }
    const url = `https://${location.hostname}/battle/${targetCharacterId}`
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&hashtags=${encodeURIComponent('AIバトラー')}`
  }, [targetCharacterId, typeof window])

  const initialize = useCallback(async () => {
    const storedCharacterId = localStorage.getItem(characterIdKey)
    if (!storedCharacterId) {
      router.push('/')
      return
    }

    const response = await axios
      .get<GetCharacterResponseData>(`/api/character/${storedCharacterId}`)
      .catch((error) => {
        console.error(error)
        return null
      })
    if (!response) {
      router.push('/')
      return
    }

    setCharacterId(response.data.character.id)
    setCharacter(response.data.character)

    await loadTargetCharacter(targetCharacterId)
  }, [targetCharacterId])

  useEffect(() => {
    if (!targetCharacterId) {
      return
    }
    initialize()
  }, [targetCharacterId])

  const loadTargetCharacter = useCallback(async (loadCharacterId: string) => {
    const response = await axios
      .get<GetCharacterResponseData>(`/api/character/${loadCharacterId}`)
      .catch((error) => {
        console.error(error)
        return null
      })
    if (!response) {
      router.push('/')
      return
    }

    setTargetCharacter(response.data.character)
  }, [])

  const battle = useCallback(async () => {
    setIsSending(true)
    setBattleResult(undefined)
    const response = await axios
      .post<BattleResponseData>('/api/battle', {
        myCharacterId: characterId,
        yourCharacterId: targetCharacterId,
      })
      .catch((error) => {
        console.error(error)
        return null
      })
    setIsSending(false)

    if (!response) {
      alert('エラーが発生しました。')
      return
    }

    setBattleResult(response.data)
  }, [characterId, targetCharacterId])

  return (
    <Container>
      {targetCharacter ? (
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
