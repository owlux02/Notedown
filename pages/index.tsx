import Head from 'next/head';
import Nav from '@/components/Nav/Nav';
import Welcome from '@/components/Welcome/Welcome';
import Footer from '@/components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Head>
        <title>Notedown</title>
        <meta
          name="description"
          content="Write better notes with Notedown, use Markdown and enjoy other features such as sync and even more!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://notedown-md.vercel.app/" />

        <meta property="og:url" content="https://notedown-md.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Notedown" />
        <meta
          property="og:description"
          content="Write better notes with Notedown, use Markdown and enjoy other features such as sync and even more!"
        />
        <meta
          property="og:image"
          content="https://notedown-md.vercel.app/img/ogImage.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="notedown-md.vercel.app" />
        <meta
          property="twitter:url"
          content="https://notedown-md.vercel.app/"
        />
        <meta name="twitter:title" content="Notedown" />
        <meta
          name="twitter:description"
          content="Write better notes with Notedown, use Markdown and enjoy other features such as sync and even more!"
        />
        <meta
          name="twitter:image"
          content="https://notedown-md.vercel.app/img/ogImage.png"
        />
      </Head>
      <Nav />
      <Welcome />
      <Footer />
    </>
  );
};

export default Home;
