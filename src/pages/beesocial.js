import Head from 'next/head';
import { RocketchatLayout } from '../components/rocketchat/rocket-layout';

const Page = ({ rocketChatUrl }) => {
  const handleGoToGeneral = () => {
    document.querySelector("iframe").contentWindow.postMessage(
      {
        externalCommand: "go",
        path: "/home"
      },
      rocketChatUrl
    );
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Beesocial | Beedata</title>
      </Head>
      <RocketchatLayout>
        <iframe
          src={`${rocketChatUrl}/home`}
          title="Beesocial"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            marginLeft: 0,
            marginTop: 0,
            border: 'none'
          }}
        />
      </RocketchatLayout>
    </>
  );
};

export const getStaticProps = async () => {
  const rocketChatUrl = process.env.BEESOCIAL_SERVER;
  return {
    props: { rocketChatUrl }
  }
};

export default Page;
