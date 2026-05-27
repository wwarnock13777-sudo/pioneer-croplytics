import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/icon.png"/>
        <link rel="icon" href="/icon.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="apple-mobile-web-app-title" content="CropLytics"/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
