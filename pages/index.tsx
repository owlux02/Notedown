import Head from 'next/head';
import Nav from '@/components/Nav/Nav';
import Welcome from '@/components/Welcome/Welcome';
import Footer from '@/components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Head>
        <title>Notedown</title>
        <meta name="description" content="Another note-talking app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <Welcome />
      <Footer />
    </>
  );
}

export default Home;
