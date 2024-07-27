import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme, checked }) => ({
  color: checked ? theme.palette.text.primary : theme.palette.text.disabled,
  '& .MuiRadio-root': {
    color: checked ? theme.palette.primary.main : theme.palette.action.disabled,
  },
}));
const defaultText=`Please choose the most suitable option for your business requirements`
// Make the component reusable by accepting options as a prop
const SingleSelectForm = ({ options, defaultValue, onChange, disabledOptions = [], text=defaultText, onValueChange }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onValueChange) {
        onValueChange(newValue);
      }
  };


  return (
    <Box sx={{ p: 2, maxWidth: 400, margin: 'auto' }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{text}</FormLabel>
        <RadioGroup value={selectedOption} onChange={handleChange}>
          {options.map((option) => (
            <StyledFormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              checked={selectedOption === option.value}
              // Optional: Disable specific options based on your needs
              disabled={disabledOptions.includes(option.value)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SingleSelectForm;
