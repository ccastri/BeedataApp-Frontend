import { v4 as uuid } from 'uuid';

export const products = [
  {
    id: uuid(),
    description: 'Whatsapp Bussines connection for your bots.',  
    media: '/static/images/products/whatsappbee.svg',
    title: 'Whatsapp Bee',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '594'
  },
  {
    id: uuid(),
    description: 'Automation tool for your team. Start managing your processes in minutes.',  
    media: '/static/images/products/flow.svg',
    title: 'Beet Bot',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '594'
  },
  {
    id: uuid(),
    description: 'Visualize and manage your data before you import it into your dashboard.',  
    media: '/static/images/products/lake.svg',
    title: 'Beet Lake',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '625'
  },
  {
    id: uuid(),
    description: 'Communication tool. Connect with your team and clients in a single place.',
    media: '/static/images/products/social.svg',
    title: 'Beet Social',
    sx: { height: '20%', width: '20%' },
    totalDownloads: '857'
  },
  {
    id: uuid(),
    description: 'Dashboard partner. Adapt your dashboard to your needs.',  
    media: '/static/images/products/powerbi.svg',
    title: 'Power BI',
    sx: { height: '10%', width: '10%' },
    totalDownloads: '406'
  },
  {
    id: uuid(),
    description: 'Chatbot for your website. Automate your customer service.',
    media: '/static/images/products/kommo.png',
    title: 'Kommo',
    sx: { height: '10%', width: '10%' },
    totalDownloads: '835'
  }
];
