import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const years = Array.from(Array(100), (_, i) => i + 2000);

const YearPicker: React.FC<YearPickerProps> = ({ onChange, value, name }) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="yearLabel">Ano</InputLabel>
      <Select labelId="yearLabel" id="yearPicker" value={value} name={name} onChange={onChange} label="Ano">
        {years.map(year => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

YearPicker.defaultProps = {
  name: 'year',
};

interface YearPickerProps {
  onChange: any;
  value: any;
  name?: string;
}

export default React.memo(YearPicker);
