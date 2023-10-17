import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/img/icon-512x512.png" />
				<meta name="theme-color" content="#1A1B1E" />
        <script src="/static/theme.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
