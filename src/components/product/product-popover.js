import React from 'react';
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
  transform: 'translateX(0)', // added to reset transform
  [theme.breakpoints.up('md')]: {
    width: '100%',
    marginLeft: 0, // changed from -theme.spacing(3)
    marginTop: 0,
    transform: 'translateX(0)', // changed from 'translateX(-8px)'
  },
  [theme.breakpoints.between('sm', 'md')]: {
    width: '80%',
    paddingBottom: '60%',
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    paddingBottom: '60%',
    paddingLeft: '8%',
    paddingRight: '8%',
    marginTop: theme.spacing(3),
  },
  '&:after': {
    content: '" "',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',   backgroundImage: '#ffffff',
    borderRadius: theme.spacing(2), // 16
    opacity: 0.2,
  },
}));

const Content = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const ProductPopover = React.memo(function ProductPopover() {
  const theme = useTheme();
  return (
    <RootCard>
      <Media
        image="/static/"
      />
      <Content>
      </Content>
    </RootCard>
  );
});