import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import { Home as HomeIcon } from '../../icons/home';
import { Bell as BellIcon } from '../../icons/bell';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { AccountPopover } from '../general/account-popover';
import NextLink from 'next/link';

const RocketNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const RocketNavbar = (props) => {
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);

  return (
    <>
      <RocketNavbarRoot
        sx={{
          width: '100%',
          left: 0
        }}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <Tooltip title="Search">
              <NextLink href="/dashboard" passHref>
                <a>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/static/beedata.svg"
                      alt="Beedata"
                      style={{
                        height: '5%',
                        width: '15%',
                        '@media (minWidth:600px)': {
                          height: '10%',
                          width: '20%',
                        },
                        '@media (minWidth:960px)': {
                          height: '10%',
                          width: '25%',
                        },
                        '@media (minWidth:1280px)': {
                          height: '12%',
                          width: '30%',
                        },
                      }} 
                      />
                    <IconButton>
                      <HomeIcon />
                    </IconButton>
                  </div>
                </a>
              </NextLink>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge
                badgeContent={4}
                color="primary"
                variant="dot"
              >
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            sx={{
              cursor: 'pointer',
              height: 40,
              width: 40,
              ml: 1
            }}
            src="/static/images/avatars/beedata.svg"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
        </Toolbar>
      </RocketNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

RocketNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
