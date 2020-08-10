import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';

const AmountPicker: React.FC<AmountPickerProps> = ({ onChange, value }) => {
  return (
    <TextField
      fullWidth
      type="number"
      label="Valor"
      variant="outlined"
      value={value}
      name="amount"
      onChange={onChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
        inputProps: {
          min: 0,
        },
      }}
    />
  );
};

interface AmountPickerProps {
  onChange: any;
  value: any;
}

export default React.memo(AmountPicker);
