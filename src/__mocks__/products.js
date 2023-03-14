import { v4 as uuid } from 'uuid';

export const products = [
  {
    id: uuid(),
    createdAt: '27/03/2022',
    description: 'Automation tool for your team. Start managing your processes in minutes.',  
    media: '/static/images/products/flow.svg',
    title: 'BeeFlow',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '594'
  },
  {
    id: uuid(),
    createdAt: '31/03/2022',
    description: 'Visualize and manage your data before you import it into your dashboard.',  
    media: '/static/images/products/lake.svg',
    title: 'BeeSual',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '625'
  },
  {
    id: uuid(),
    createdAt: '03/04/2019',
    description: 'Communication tool. Connect with your team and clients in a single place.',
    media: '/static/images/products/social.svg',
    title: 'BeeSocial',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '857'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Dashboard partner. Adapt your dashboard to your needs.',  
    media: '/static/images/products/powerbi.svg',
    title: 'Power BI',
    sx: { height: '10%', width: '10%' },
    totalDownloads: '406'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Chatbot for your website. Automate your customer service.',
    media: '/static/images/products/kommo.png',
    title: 'Kommo',
    sx: { height: '10%', width: '10%' },
    totalDownloads: '835'
  },
  {
    id: uuid(),
    createdAt: '04/04/2019',
    description: 'Open source chat. Alternatives to connect with your team and clients.',
    media: '/static/images/products/b2chat.jpeg',
    title: 'B2Chat',
    sx: { height: '10%', width: '10%' },
    totalDownloads: '835'
  }
];
