import Head from 'next/head';
import MainLayout from '../components/home-layout';


const MainPage = () => (
  <>
     <Head>
      <title>Beedata | Home</title>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
    </Head>
  </>
);

MainPage.getLayout = (MainPage) => (
    <MainLayout>
      {MainPage}
    </MainLayout>
  );

export default MainPage;
