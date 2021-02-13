import '@assets/main.scss'
import 'keen-slider/keen-slider.min.css'
import '@assets/chrome-bug.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'

import { ManagedUIContext } from '@components/ui/context'
import { Head } from '@components/common'
import StateProvider, { StateReducer } from 'providers/StateProvider'
import { initialState } from 'providers/StateProvider/StateReducer'
import { FirebaseAppProvider } from 'reactfire'

const Noop: FC = ({ children }) => <>{children}</>

const firebaseConfig = {
  apiKey: "AIzaSyC8YJurl2zTYsHR7OttmfIxdfc0RwFVkP4",
  authDomain: "malgudis-22a92.firebaseapp.com",
  projectId: "malgudis-22a92",
  storageBucket: "malgudis-22a92.appspot.com",
  messagingSenderId: "426013044879",
  appId: "1:426013044879:web:593a9eba071c421452c0fa",
  measurementId: "G-0MMTMEF86S"
};

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
            <FirebaseAppProvider firebaseConfig={firebaseConfig}>
              <Component {...pageProps} />
            </FirebaseAppProvider>
          </Layout>
        </ManagedUIContext>
      </StateProvider>
    </>
  )
}
