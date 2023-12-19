import React, { useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../contexts/auth';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';

import { User as UserIcon } from '../../icons/user';

/** 
 * Account popover component
 * 
 * @param {object} props - component props
 * @param {object} props.anchorEl - anchor element
 * @param {object} props.onClose - a function that is called when closing the popover
 * @param {boolean} props.open - an indicator if the popover is open or not
 * @param {string} props.redirectLink - a string that specifies the redirection link
 * 
 * @returns {JSX.Element} - a JSX.Element representing the account popover component
 * 
 */
export const AccountPopover = (props) => {
  // retrieve Next.js router object
  const router = useRouter();
  const { anchorEl, onClose, open, ...other } = props;
  const { token, logout } = useContext(AuthContext);

  const handleProfile = () => {
    onClose?.();
    router.push('/account');
  }

  // Sign out
  const handleSignOut = async () => {
    onClose?.();

    if (token) {
      logout();
    }
    router.push('/');
    };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: '300px' },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <UserIcon sx={{ mr: 1 }} />
        <Typography
          color="primary"
          variant="subtitle1"
          onClick={handleProfile}
          style={{ cursor: 'pointer' }}
        >
          My Profile
        </Typography>
      </Box>
      { token && (
        <MenuList
          disablePadding
          sx={{
          '& > *': {
            '&:first-of-type': {
              borderTopColor: 'divider',
              borderTopStyle: 'solid',
              borderTopWidth: '1px'
            },
            padding: '12px 16px'
          }
        }}
      >
      <MenuItem onClick={handleSignOut}
color="textPrimary">
        <LogoutIcon sx={{ mr: 1 }} />
        Sign out
      </MenuItem>
      </MenuList>
      )}
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
