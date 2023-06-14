import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';


const StyledCard = styled(Card)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    maxWidth: isSmallScreen ? '90vw' : '60vw',
    margin: 'auto',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
  };
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    borderRadius: 6,
    width: isSmallScreen ? 150 : 200,
    height: isSmallScreen ? 150 : 200,
  };
});

export const ProductActivation = (props) => {
  const { name, image, description } = props;
  const [open, setOpen] = useState(false);

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm(); // Reset form values
    setOpen(false);
  };


  const onSubmit = async (values) => {
    console.log('values', values);
  };


  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        fullWidth
        color="secondary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
      >
        Activate
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isSmallScreen ? '90vw' : isMediumScreen ? '60vw' : '40vw',
            height: isSmallScreen ? '70vh' : isMediumScreen ? '75vh' : '60vh',
            overflow: 'hidden',
          },

        }}
      >
        <DialogContent>
          <StyledCard>
            <Grid container
spacing={2}>
              <Grid item
xs={5}>
                <StyledCardMedia image={image} />
              </Grid>
              <Grid item
xs={7}>
                <CardContent>
                  <Typography gutterBottom
variant="h4"
component="div">
                    {name}
                  </Typography>
                    <Typography variant="body2"
color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </StyledCard>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogActions>
            <Box sx={{ 
                minWidth: isSmallScreen ? '40vw' : isMediumScreen ? '35vw' : '25vw',
                maxWidth: isSmallScreen ? '60vw' : isMediumScreen ? '36vw' : '26vw',
                minHeight: isSmallScreen ? '40vh' : isMediumScreen ? '35vh' : '25vh',
                maxHeight: isSmallScreen ? '30vh' : isMediumScreen ? '35vh' : '35vh'
              }}
            >

            </Box>
            <Button onClick={handleClose}
color="secondary">
                Cancel
            </Button>
            <Button onClick={handleClose}
color="primary">
                Activate
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};
