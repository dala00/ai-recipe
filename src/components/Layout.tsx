import { Box, Center } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const title = 'AIレシピジェネレータ'
  const description =
    '余った食材からChatGPTのAIがレシピを考えてくれるサービスです。'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-M8DFDZV');
      `,
        }}
      /> */}
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box
          flexGrow={0}
          p={4}
          borderBottomColor="gray.300"
          borderBottomWidth={1}
          mb={4}
          fontWeight="bold"
        >
          <Link href="/">{title}</Link>
        </Box>
        <Box flexGrow={1}>{children}</Box>
        <Box flexGrow={0} textAlign="center" background="gray.300" p={4} mt={6}>
          <Center>
            &copy;{' '}
            <a
              href="https://twitter.com/dala00"
              target="_blank"
              rel="nofollow noopener me"
              style={{ textDecoration: 'underline' }}
            >
              dala00
            </a>
          </Center>
        </Box>
      </Box>
    </>
  )
}
