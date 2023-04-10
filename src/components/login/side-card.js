import React from 'react';
import cx from 'clsx';
import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const RootCard = styled(Card)(({ theme }) => ({
  margin: 'auto',
  borderRadius: theme.spacing(2), // 16px
  transition: '0.3s',
  boxShadow: '0px 0px 32px rgba(255, 255, 255, 0.3)',
  position: 'relative',
  maxWidth: 600,
  marginLeft: 'auto',
  overflow: 'initial',
  background: 'linear-gradient(147deg, #00337C 0%, #1C82AD 65%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    paddingTop: theme.spacing(2),
  }
}));

const Media = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: -theme.spacing(3),
  height: 0,
  paddingBottom: '48%',
  paddingLeft: '12%',
  paddingRight: '12%',
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
  position: 'relative',
  boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
  [theme.breakpoints.up('md')]: {
    width: '100%',
    marginLeft: -theme.spacing(3),
    marginTop: 0,
    transform: 'translateX(-8px)',
  },
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: '#ffffff',
    borderRadius: theme.spacing(2), // 16
    opacity: 0.2,
  },
}));

const Content = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const BeeCard = React.memo(function BeeCard() {
  const theme = useTheme();
  return (
    <RootCard>
      <Media
        image="/static/logo-beedata.png"
      />
      <Content>
        <Typography variant="h5" gutterBottom sx={{ mt: 2, color: '#ffffff' }}>
          <strong>{'CONNECT TO THE WORLD OF AUTOMATED SERVICES'}</strong>
        </Typography>
        <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
          {'Our cloud-based platform allows you to access and share relevant data anytime, anywhere.'}
        </Typography>
      </Content>
    </RootCard>
  );
});
