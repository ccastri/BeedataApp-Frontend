import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material'

export const AccountPopover = (props) => {
  const router = useRouter();
  const { anchorEl, onClose, open, ...other } = props;
  const { data: session, loading } = useSession();
  const token = localStorage.getItem('jwt');

  // Check for next-auth Google login session 
  // or loclastorage JWT token for email login.

  const handleSignOut = async () => {
    onClose?.()
    
    if (session && session.user) {
      await signOut()
    } else {
      if (token) {
        localStorage.removeItem('jwt');
      }
    }
  
    router.push('/')
  }

    // Retrieve user name from session or JWT token
    const getUserName = () => {
      if (session && session.user) {
        return session.user.name?.split(' ')[0];
      } else {
        const token = localStorage.getItem('jwt');
        if (token) {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          return payload.userName;
        }
      }
      return '';
    }
  

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
        sx: { width: '300px' }
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {getUserName()}
        </Typography>
      </Box>
      {!loading && ( session || token ) ? (
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
        <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
      </MenuList>
      ) : null}
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
