import React from 'react';
import { makeStyles, Grid, Typography, Button, GridSpacing } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(
  () => ({
    main: {
      marginTop: '50px',
    },
    noPadding: {
      padding: '0!important',
    },
  }),
  { name: 'HeaderLabelButton' }
);

const HeaderLabelButton: React.FC<HeaderLabelButtonProps> = ({ label, spacing, noButton }) => {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.main} spacing={spacing}>
      <Grid item xs={12}>
        <Typography variant="h6" align="center">
          {label}
        </Typography>
      </Grid>
      {!noButton && (
        <Grid item className={classes.noPadding}>
          <Link to="/">
            <Button variant="text">Início</Button>
          </Link>
        </Grid>
      )}
    </Grid>
  );
};

interface HeaderLabelButtonProps {
  label: string;
  spacing: GridSpacing;
  noButton?: boolean;
}

export default HeaderLabelButton;
