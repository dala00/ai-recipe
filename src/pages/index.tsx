import Head from 'next/head'
import {
  Box,
  Button,
  Container,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
  useToast,
} from '@chakra-ui/react'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import StatusSlider from '@/components/StatusSlider'
import { EditCharacter } from '@/types/entity/Character'
import axios from 'axios'
import {
  GetCharacterResponseData,
  StoreCharacterResponseData,
} from '@/types/response/character'
import { ResultResponseData } from '@/types/response/response'
import Link from 'next/link'

const characterIdKey = 'characterId'

export default function Home() {
  const toast = useToast()
  const [characterId, setCharacterId] = useState('')
  const [character, setCharacter] = useState<EditCharacter>({
    power: 20,
    guard: 20,
    magicPower: 20,
    magicGuard: 20,
    speed: 20,
    skill: '',
  })
  const [isSending, setIsSending] = useState(false)
  const statusSum =
    character.power +
    character.guard +
    character.magicPower +
    character.magicGuard +
    character.speed

  const initialize = useCallback(async () => {
    const storedCharacterId = localStorage.getItem(characterIdKey)
    if (!storedCharacterId) {
      return
    }

    const response = await axios
      .get<GetCharacterResponseData>(`/api/character/${storedCharacterId}`)
      .catch((error) => {
        console.error(error)
        return null
      })
    if (!response) {
      return
    }

    setCharacterId(response.data.character.id)
    setCharacter(response.data.character)
  }, [])

  useEffect(() => {
    initialize()
  }, [])

  const create = useCallback(async () => {
    setIsSending(true)
    const response = await axios
      .post<StoreCharacterResponseData>('/api/character/store', { character })
      .catch((error) => {
        console.error(error)
        return null
      })
    setIsSending(false)

    if (!response) {
      alert('エラーが発生しました。')
      return
    }

    setCharacterId(response.data.character.id)
    localStorage.setItem(characterIdKey, response.data.character.id)

    toast({
      title: '登録しました。対戦しに行ってみよう！',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }, [character])

  const update = useCallback(async () => {
    setIsSending(true)
    const response = await axios
      .post<ResultResponseData>(`/api/character/${characterId}/update`, {
        character,
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

    toast({
      title: '更新しました',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }, [character, characterId])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (characterId === '') {
        create()
      } else {
        update()
      }
    },
    [character, characterId]
  )

  return (
    <>
      <Container>
        {!characterId && (
          <Box textAlign="center" pb={4}>
            まずは自分のキャラを作成しよう
          </Box>
        )}
        <form onSubmit={onSubmit}>
          <TableContainer>
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Th width="50px">攻撃力</Th>
                  <Td>
                    <StatusSlider
                      value={character.power}
                      onChange={(power) =>
                        setCharacter({ ...character, power })
                      }
                    />
                  </Td>
                  <Td width="30px">{character.power}</Td>
                </Tr>
                <Tr>
                  <Th>防御力</Th>
                  <Td>
                    <StatusSlider
                      value={character.guard}
                      onChange={(guard) =>
                        setCharacter({ ...character, guard })
                      }
                    />
                  </Td>
                  <Td>{character.guard}</Td>
                </Tr>
                <Tr>
                  <Th>魔力</Th>
                  <Td>
                    <StatusSlider
                      value={character.magicPower}
                      onChange={(magicPower) =>
                        setCharacter({ ...character, magicPower })
                      }
                    />
                  </Td>
                  <Td>{character.magicPower}</Td>
                </Tr>
                <Tr>
                  <Th>魔法防御力</Th>
                  <Td>
                    <StatusSlider
                      value={character.magicGuard}
                      onChange={(magicGuard) =>
                        setCharacter({ ...character, magicGuard })
                      }
                    />
                  </Td>
                  <Td>{character.magicGuard}</Td>
                </Tr>
                <Tr>
                  <Th>素早さ</Th>
                  <Td>
                    <StatusSlider
                      value={character.speed}
                      onChange={(speed) =>
                        setCharacter({ ...character, speed })
                      }
                    />
                  </Td>
                  <Td>{character.speed}</Td>
                </Tr>
                <Tr>
                  <Th>合計</Th>
                  <Td colSpan={2} textAlign="right">
                    <Text color={statusSum > 100 ? 'red' : ''} display="inline">
                      {statusSum}
                    </Text>{' '}
                    / 100
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={3}>
                    <Box textTransform="uppercase">
                      能力
                      <Box as="span" color="gray.500">
                        （自由だが相手に関わらず
                        <br />
                        勝敗確定してしまう能力は
                        <Box display={{ md: 'none' }} />
                        反則判定となるぞ）
                      </Box>
                    </Box>
                    <Textarea
                      mt={2}
                      value={character.skill}
                      rows={10}
                      onChange={(e) =>
                        setCharacter({ ...character, skill: e.target.value })
                      }
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt={4} textAlign="center">
            {isSending ? (
              <Spinner />
            ) : (
              <Button
                type="submit"
                colorScheme="blue"
                isDisabled={statusSum > 100}
              >
                {characterId === '' ? <>キャラクターを作成</> : <>更新する</>}
              </Button>
            )}
          </Box>
        </form>
        <Box textAlign="center" mt={8}>
          <Link passHref href="/battle">
            <Button type="button" colorScheme="teal">
              対戦しにいく！
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  )
}
