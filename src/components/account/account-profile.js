import React, {useContext} from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { getUserId } from '../../utils/get-user-data';
import { AuthContext } from '../../contexts/auth';
import api from '../../lib/axios';

export const AccountProfile = (props) => {
  const [user, setUser] = useState({});
  const userId = getUserId();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/backend/api/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [token, userId]);

  return (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar ? user.avatar : '/static/images/avatars/beedata.svg'}
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Name'}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Role'}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    {/* <CardActions>
      <Button
        color="primary"
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions> */}
  </Card>
);
}
