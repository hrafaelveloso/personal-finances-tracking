import React, { useState } from 'react';
import { makeStyles, Grid, Typography, Paper, Divider, Button } from '@material-ui/core';
import { ILog } from '../interfaces';
import useLastLogs from '../utils/swr-hooks/useLastLogs';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import isEmpty from '../utils/isEmpty';
import ErrorMessage from './ErrorMessage';
import axios from 'axios';

const useStyles = makeStyles(
  theme => ({
    entry: {
      marginBottom: '12px',
    },
    paper: {
      padding: '20px',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      color: theme.palette.error.main,
    },
    margin: {
      margin: '5px 0px',
    },
  }),
  { name: 'LogEntry' }
);

const ItemTypography: React.FC<ItemTypographyProps> = ({ label, value }) => {
  return (
    <Grid item xs={12}>
      <Typography variant="h6">{label}</Typography>
      <Typography>{value}</Typography>
    </Grid>
  );
};

interface ItemTypographyProps {
  label: string;
  value: string;
}

const LogEntry: React.FC<ILogEntryProps> = ({ log }) => {
  const classes = useStyles();
  const { from, to, amount, _id } = log;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const { logs, mutate } = useLastLogs();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      mutate(
        logs.filter(logItem => logItem._id !== _id),
        false
      );

      await axios.delete(`/logs/${_id}`);
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <>
      <Grid container className={classes.entry}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={8}>
                <Grid container spacing={2}>
                  <ItemTypography label="De: " value={from?.name} />
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <ItemTypography label="Para: " value={to?.name} />
                </Grid>
              </Grid>
              <Grid item xs={4} className={classes.center}>
                <div>
                  <Typography variant="h6">Valor: </Typography>
                  <Typography>{amount} €</Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container className={classes.margin}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  variant="text"
                  className={classes.button}
                  onClick={e => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Apagar entrada
                </Button>
              </Grid>
            </Grid>
            {!isEmpty(error) && <ErrorMessage message={error} />}
          </Paper>
        </Grid>
      </Grid>
      <ConfirmDeleteDialog
        open={open}
        handleClose={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          setOpen(false);
        }}
        handleSubmit={handleDelete}
      />
    </>
  );
};

interface ILogEntryProps {
  log: ILog;
}

export default React.memo(LogEntry);
