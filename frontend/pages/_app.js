import '../styles/animals.scss'
import getLibrary from "../getLibrary";
import { Web3ReactProvider } from "@web3-react/core";
import Head from 'next/head'
import React from 'react';
import LoadingScreen from '../components/loadingscreen'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(()=>{
    setLoading(false);
  }, []);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next {
            height: 100%;
            width: 100%;
          }
          body::-webkit-scrollbar {
              display: none;
          }
        `}</style>
        <Head>
          <link rel="apple-touch-icon" sizes="57x57" href="/static/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/static/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/static/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/static/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/static/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/static/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/static/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/static/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/static/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/static/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
          <link rel="manifest" href="/static/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        {loading && <LoadingScreen />}
        {!loading &&  <Component {...pageProps} /> }
      </Web3ReactProvider>
  );
}

export default MyApp
