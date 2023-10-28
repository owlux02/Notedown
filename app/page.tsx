import Nav from '@/components/Nav/Nav';
import Welcome from '@/components/Welcome/Welcome';
import Footer from '@/components/Footer/Footer';

export const metadata = {
  openGraph: {
    title: 'Notedown',
    description:
      'Write better notes with Notedown, use Markdown and enjoy other features such as sync and even more!',
    url: 'https://notedown-md.vercel.app/',
    siteName: 'Notedown',
    images: [
      {
        url: 'https://notedown-md.vercel.app/img/ogImage.png',
        width: 686,
        height: 264,
        alt: 'Notedown OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notedown',
    description:
      'Write better notes with Notedown, use Markdown and enjoy other features such as sync and even more!',
    creator: '@martinval11_',
    images: ['https://notedown-md.vercel.app/img/ogImage.png'],
  },
};

const Home = () => {
  return (
    <>
      <Nav />
      <Welcome />
      <Footer />
    </>
  );
};

export default Home;
