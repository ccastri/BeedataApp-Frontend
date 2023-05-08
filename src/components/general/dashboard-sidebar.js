import React from 'react';
import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Payment as PaymentIcon } from '../../icons/payment';
import { ShoppingBag as ShoppingBagIcon } from '../../icons/shopping-bag';
import { User as UserIcon } from '../../icons/user';
import { Users as UsersIcon } from '../../icons/users';
import { NavItem } from './nav-item';

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
    href: 'https://pruebas.beedata.co/signin',
    icon: (<SmartToyIcon fontSize="small" />),
    target: '_blank',
    title: 'Beet Bot'
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
  {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    target: '_self',
    title: 'Account'
  },
  // {
  //   href: '/settings',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Settings'
  // }
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

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
