import Head from 'next/head';
import { RocketchatLayout } from '../components/rochetchat/rocket-layout';

const Page = () => {
  const handleGoToGeneral = () => {
    document.querySelector("iframe").contentWindow.postMessage(
      {
        externalCommand: "go",
        path: "/channel/general"
      },
      "https://social2.beedata.co"
    );
  };


  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Beesocial | Beedata</title>
        <style>
          {`
            iframe {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              border: none;
            }
          `}
        </style>
      </Head>
      <RocketchatLayout>
        <iframe src="https://social2.beedata.co/channel/general" title="Beesocial"></iframe>
      </RocketchatLayout>
    </>
  );
};


export default Page;
