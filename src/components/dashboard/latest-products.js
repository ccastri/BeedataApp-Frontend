import { formatDistanceToNow, subHours } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const products = [
  {
    id: uuid(),
    name: 'Beeflow',
    imageUrl: '/static/images/products/beeflow.svg',
    updatedAt: subHours(Date.now(), 2)
  },
  {
    id: uuid(),
    name: 'Beesual',
    imageUrl: '/static/images/products/beesual.svg',
    updatedAt: subHours(Date.now(), 2)
  },
  {
    id: uuid(),
    name: 'Beesocial',
    imageUrl: '/static/images/products/beesocial.svg',
    updatedAt: subHours(Date.now(), 3)
  },
  {
    id: uuid(),
    name: 'Power Bi',
    imageUrl: '/static/images/products/powerbi.svg',
    updatedAt: subHours(Date.now(), 5)
  }
];

export const LatestProducts = (props) => (
  <Card {...props}>
    <CardHeader
      subtitle={`${products.length} in total`}
      title="Best Selling Products"
    />
    <Divider />
    <List>
      {products.map((product, i) => (
        <ListItem
          divider={i < products.length - 1}
          key={product.id}
        >
          <ListItemAvatar>
            <img
              alt={product.name}
              src={product.imageUrl}
              style={{
                height: 48,
                width: 48
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={product.name}
            secondary={`Updated ${formatDistanceToNow(product.updatedAt)}`}
          />
          <IconButton
            edge="end"
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
    <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon />}
        size="medium"
        variant="contained"
        onClick={() => {
          alert('clicked');
        }}
      >
        View all
      </Button>
    </Box>
  </Card>
);
