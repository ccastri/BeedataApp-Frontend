import React from 'react';
import { useEffect } from 'react';
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

const userRole = getUserRole();
const items = [
  {
    href: '/dashboard',
    icon: (<QueryStatsIcon fontSize="small" />),
    target: '_self',
    title: 'Consumption'
  },
  {
    href: 'https://social.beet.digital/home',
    icon: (<ThreePIcon fontSize="small" />),
    target: '_blank',
    title: 'Beet Social'
  },
  {
    href: 'https://lake.beet.digital/dashboard/#/signin',
    icon: (<StorageIcon fontSize="small" />),
    target: '_blank',
    title: 'Beet Lake'
  },
  {
    href: '/coming-soon',
    icon: (<SmartToyIcon fontSize="small" />),
    target: '_self',
    title: 'Beet Bots'
  },
  {
    href: '/products',
    icon: (<BuildIcon fontSize="small" />),
    target: '_self',
    title: 'Beet Tools'
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

if (userRole === 'superadmin' || userRole === 'partner' || userRole === 'admin') {
  let pageName = 'Users';
  if (userRole === 'partner') {
    pageName = 'Users & Companies';
  }

  items.push({
    href: '/users',
    icon: (<GroupsIcon fontSize="small" />),
    target: '_self',
    title: pageName
  });
}


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
