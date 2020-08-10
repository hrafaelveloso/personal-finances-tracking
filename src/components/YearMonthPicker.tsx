import React from 'react';
import { Grid } from '@material-ui/core';
import YearPicker from './YearPicker';
import MonthPicker from './MonthPicker';

const YearMonthPicker: React.FC<YearMonthPickerProps> = ({
  onChange,
  yearValue,
  yearName,
  monthValue,
  monthName,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <YearPicker onChange={onChange} value={yearValue} name={yearName} />
      </Grid>
      <Grid item xs={6}>
        <MonthPicker onChange={onChange} value={monthValue} name={monthName} />
      </Grid>
    </Grid>
  );
};

YearMonthPicker.defaultProps = {
  yearName: 'year',
  monthName: 'month',
};

interface YearMonthPickerProps {
  onChange: any;
  yearValue: any;
  monthValue: any;
  yearName?: string;
  monthName?: string;
}

export default React.memo(YearMonthPicker);
