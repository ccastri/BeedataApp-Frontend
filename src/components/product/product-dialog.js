import React, { useState } from 'react';
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
import TextFieldWrapper from '../general/textfield-wrapper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';

const StyledCard = styled(Card)({
  maxWidth: '60vw',
  margin: 'auto',
  borderRadius: 12,
  padding: 12,
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
});

const StyledCardMedia = styled(CardMedia)({
  borderRadius: 6,
  width: 200,
  height: 200,
});

export const ProductDialog = (props) => {
  const { name, description, image } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm(); // Reset form values
    setOpen(false);
  };

  const onSubmit = async (values) => {
    try {
      console.log(values);

    } catch (error) {
      console.error(error);
    }
  };


  const durationTypes = [
        { value: '6 months', label: '6 months' }, 
        { value: '12 months', label: '12 months' }
  ];

  const planLevelTypes = [
        { value: 'Free', label: 'Free' },
        { value: 'Basic', label: 'Basic' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Enterprise', label: 'Enterprise' }
  ];

  const beetSocialTypes = [
        { value: '0 Agents', label: '0' },
        { value: '2 Agents', label: '2' }
  ];

  const formik = useFormik({
    initialValues: {
      duration: '',
      plan_level: '',
      with_social: '',
  },
    onSubmit
  });

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        fullWidth
        color="secondary"
        sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      >
        Purchase
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
        sx: {
          width: useMediaQuery('(max-width:600px)') ? '90vw' :
            useMediaQuery('(max-width:960px)') ? '60vw' : '30vw',
          height: useMediaQuery('(max-width:600px)') ? '90vh' :
            useMediaQuery('(max-width:960px)') ? '80vh' : '60vh',
          overflow: 'hidden',
        },
      }}
      >
        <DialogContent>
          <StyledCard>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <StyledCardMedia image={image} />
              </Grid>
              <Grid item xs={7}>
                <CardContent>
                  <Typography gutterBottom variant="h4" component="div">
                    {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </StyledCard>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DialogActions>
            <Box sx={{ maxWidth: '400px' }}>
              <form onSubmit={formik.handleSubmit}>
                <TextFieldWrapper
                  formik={formik}
                  name="duration"
                  label="Duration"
                  selectOptions={durationTypes}
                />
                <TextFieldWrapper
                  formik={formik}
                  name="plan_level"
                  label="Plan Level"
                  selectOptions={planLevelTypes}
                />
                <TextFieldWrapper
                  formik={formik}
                  name="with_social"
                  label="With Beet Social"
                  selectOptions={beetSocialTypes}
                />
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  fullWidth
                  sx={{ mb: 1, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="secondary"
                  sx={{ mb: 2, mt: 1, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)'}}
                >
                  Purchase
                </Button>
              </form>
            </Box>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
