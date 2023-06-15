import React from 'react';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Payment as PaymentIcon } from '../../icons/payment';
import { ShoppingBag as ShoppingBagIcon } from '../../icons/shopping-bag';
import { Cog as CogIcon } from '../../icons/cog';
import { Users as UsersIcon } from '../../icons/users';
import { NavItem } from './nav-item';
import api from '../../lib/axios';

const items = [
  {
    href: '/dashboard',
    icon: (<TrendingDownIcon fontSize="small" />),
    target: '_self',
    title: 'Consumption'
  },
  {
    href: 'https://social.beet.digital/home',
    icon: (<UsersIcon fontSize="small" />),
    target: '_blank',
    title: 'Beet Social'
  },
  {
    href: 'https://lake.beedata.co/dashboard/#/signin',
    icon: (<StorageIcon fontSize="small" />),
    target: '_blank',
    title: 'Beet Lake'
  },
  {
    href: '/bots',
    icon: (<SmartToyIcon fontSize="small" />),
    target: '_self',
    title: 'Beet Bots'
  },
  {
    href: '/products',
    icon: (<ShoppingBagIcon fontSize="small" />),
    target: '_self',
    title: 'Products'
  },
  {
    href: '/payments',
    icon: (<PaymentIcon fontSize="small" />),
    target: '_self',
    title: 'Payments'
  },
  // {
  //   href: '/settings',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Settings'
  // },
];

/** 
 * Sidebar component for the dashboard page that contains navigation items
 * 
 * @param {Object} props - The properties passed to the component
 * @param {Boolean} props.open - Whether the sidebar is open
 * @param {Function} props.onClose - Function to close the sidebar
 * 
 * @returns {JSX.Element} - The JSX representation of the dashboard sidebar
 * 
 */
export const DashboardSidebar = (props) => {
  const [n8nDomain, setN8nDomain] = useState(''); 
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  // Get user company n8n_domain property
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/v1/companies/company', {
          headers: {  
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data && response.data.company) {
          // Check if domain is empty
          if (response.data.company.n8n_domain) {
            setN8nDomain(response.data.company.n8n_domain);
          } else {
            setN8nDomain('https://pruebas.beedata.co/signin');
          }
        } else {
          console.error('Invalid response:', response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

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
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={
                item.title === 'Beet Bot' ? n8nDomain : item.href
              }
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
