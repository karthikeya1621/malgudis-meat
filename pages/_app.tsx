import '@assets/main.scss'
import 'keen-slider/keen-slider.min.css'
import '@assets/chrome-bug.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'

import { ManagedUIContext } from '@components/ui/context'
import { Head } from '@components/common'
import StateProvider, { StateReducer } from 'providers/StateProvider'
import { initialState } from 'providers/StateProvider/StateReducer'

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <StateProvider reducer={StateReducer} initialState={initialState}>
        <ManagedUIContext>
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ManagedUIContext>
      </StateProvider>
    </>
  )
}
