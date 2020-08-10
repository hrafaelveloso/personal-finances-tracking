import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MonthPicker: React.FC<MonthPickerProps> = ({ onChange, value, name }) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="monthLabel">Mês</InputLabel>
      <Select labelId="monthLabel" id="monthPicker" value={value} name={name} onChange={onChange} label="Mês">
        {months.map((month, idx) => (
          <MenuItem key={month} value={idx + 1}>
            {month}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

MonthPicker.defaultProps = {
  name: 'month',
};

interface MonthPickerProps {
  onChange: any;
  value: any;
  name?: string;
}

export default React.memo(MonthPicker);
