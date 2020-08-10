import React from 'react';
import { Grid, Typography } from '@material-ui/core';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Grid container spacing={4} justify="center">
      <Grid item xs={10} md={6}>
        <Typography align="center" color="error">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

interface ErrorMessageProps {
  message: string;
}

export default React.memo(ErrorMessage);
