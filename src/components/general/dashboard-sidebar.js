import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GroupsIcon from '@mui/icons-material/Groups';
import ThreePIcon from '@mui/icons-material/ThreeP';
import BuildIcon from '@mui/icons-material/Build';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { Payment as PaymentIcon } from '../../icons/payment';
import { Cog as CogIcon } from '../../icons/cog';
import { NavItem } from './nav-item';
import { DropDown } from './dropdown-list';
import { getUserRole } from '../../utils/get-user-data';
import api from '../../lib/axios';

const icons = {
  QueryStatsIcon: <QueryStatsIcon fontSize="small" />,
  ThreePIcon: <ThreePIcon fontSize="small" />,
  StorageIcon: <StorageIcon fontSize="small" />,
  SmartToyIcon: <SmartToyIcon fontSize="small" />,
  BuildIcon: <BuildIcon fontSize="small" />,
  PaymentIcon: <PaymentIcon fontSize="small" />,
  CogIcon: <CogIcon fontSize="small" />,
  GroupsIcon: <GroupsIcon fontSize="small" />
};

const userRole = getUserRole();

export const DashboardSidebar = ({ open, onClose }) => {
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });
  const [chatwootUrl, setChatwootUrl] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUrl = async () => {
      const response = await api.get('/api/v1/chatwoot/sso', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setChatwootUrl(response.data.chatwoot_url);
      }
    };

    fetchUrl();
  }, [token]); 



  const itemsData = [
    ['dashboard', 'QueryStatsIcon', '_self', 'Consumption'],
    [ chatwootUrl, 'ThreePIcon', '_blank', 'Beet Social'],
    ['https://lake.beet.digital/dashboard/#/signin', 'StorageIcon', '_blank', 'Beet Lake'],
    ['/coming-soon', 'SmartToyIcon', '_self', 'Beet Bots'],
    ['/products', 'BuildIcon', '_self', 'Beet Tools'],
    ['/payments', 'PaymentIcon', '_self', 'Payments'],
  ];
  
  if (['superadmin', 'partner', 'admin'].includes(userRole)) {
    const pageName = userRole === 'partner' ? 'Users & Companies' : 'Users';
    itemsData.push(['/users', 'GroupsIcon', '_self', pageName]);
  }
  
  const items = itemsData.map(([href, icon, target, title]) => ({ href, icon: icons[icon], target, title }));

  useEffect(() => {
    if (router.isReady && open) {
      onClose?.();
    }
  }, [router.asPath]);

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink
              href="/dashboard"
              passHref
            >
              <a>
                <img
                  src="/static/beet_nb.svg"
                  alt="Beedata"
                  width="100%"
                  style={{ marginBottom: '-60px', marginTop: '-10px' }}
                />
              </a>
            </NextLink>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            mx: 1,
            my: 3
          }}
        />
        {(getUserRole() === 'superadmin' || getUserRole() === 'partner' ) && (
          <Box sx={{ p: 1 }}>
            <DropDown />
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              target={item.target}
            />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        data-testid="dashboard-sidebar"
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      data-testid="hidden-dashboard-sidebar"
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
