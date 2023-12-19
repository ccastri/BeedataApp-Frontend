import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from './auth-guard';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import dynamic from 'next/dynamic';
import "react-whatsapp-chat-widget/index.css";

const WhatsAppWidget = dynamic(() => import("react-whatsapp-chat-widget"), {
  ssr: false,
});


const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <DashboardLayoutRoot
        data-testid="dashboard-layout-root"
      >
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <WhatsAppWidget
        phoneNo="573242191970"
        position="right"
        widgetWidth="400px"
        widgetWidthMobile="100px"
        autoOpen={false}
        autoOpenTimer={3000}
        messageBox={true}
        iconSize="80"
        iconColor="white"
        iconBgColor="#5ad167"
        headerIcon="/static/beet_nb.svg"
        headerIconColor="#FFFFFF"
        headerTxtColor="#FFFFFF"
        headerBgColor="#095E54"
        headerTitle="Beet Bot"
        headerCaption="Online"
        bodyBgColor="#ECF8F9"
        chatPersonName="Beet Bot"
        chatMessage={<>Hi there 👋 <br /><br /> How can I help you?</>}
        footerBgColor="#f0f0f0"
        placeholder="Type a message.."
        btnBgColor="#4FCE5D"
        btnTxt="Send"
        btnTxtColor="#FFFFFF"
      />
    </AuthGuard>
  );
};
