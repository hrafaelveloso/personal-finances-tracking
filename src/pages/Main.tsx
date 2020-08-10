import React, { useReducer, useCallback } from 'react';
import { Grid, Typography, makeStyles, Button, TextField, Box } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import useLastLogs from '../utils/swr-hooks/useLastLogs';
import useCategories from '../utils/swr-hooks/useCategories';
import { getYear, getMonth } from 'date-fns';
import isEmpty from '../utils/isEmpty';
import axios from 'axios';
import YearPicker from '../components/YearPicker';
import MonthPicker from '../components/MonthPicker';
import AmountPicker from '../components/AmountPicker';
import ErrorMessage from '../components/ErrorMessage';
import LogEntry from '../components/LogEntry';
import { trigger } from 'swr';

const useStyles = makeStyles(
  () => ({
    main: {
      marginTop: '50px',
    },
  }),
  { name: 'Main' }
);

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'UPDATE_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.value,
      };
    case 'CLEAR_STATE':
      return {
        ...state,
        inputs: {
          fromInput: '',
          toInput: '',
        },
        values: {
          from: null,
          to: null,
        },
        year: getYear(new Date()),
        month: getMonth(new Date()) + 1,
        amount: 0,
        error: '',
      };
    default:
      return state;
  }
};

const Main: React.FC = () => {
  const classes = useStyles();
  const { logs, isLoading, mutate } = useLastLogs();
  const { categories } = useCategories();
  const [state, dispatch] = useReducer(reducer, {
    inputs: {
      fromInput: '',
      toInput: '',
    },
    values: {
      from: null,
      to: null,
    },
    year: getYear(new Date()),
    month: getMonth(new Date()) + 1,
    amount: 0,
    error: '',
  });

  const { inputs, values, year, month, amount, error } = state;
  const { fromInput, toInput } = inputs;

  const updateField = useCallback(e => {
    dispatch({ type: 'UPDATE_FIELD', payload: { name: e.target.name, value: e.target.value } });
  }, []);

  const saveLog = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const date = new Date(year, month, 15);

    const newLog = {
      from: values?.from?._id,
      to: values?.to?._id,
      amount,
      date,
    };

    try {
      dispatch({ type: 'SET_ERROR', value: '' });

      await axios.post('/logs', newLog);
      trigger('/logs/last');

      dispatch({ type: 'CLEAR_STATE' });
    } catch (err) {
      if (err?.response?.data?.message) {
        dispatch({ type: 'SET_ERROR', value: err.response.data.message });
      }
      mutate();
    }
  };

  return (
    <>
      <Grid container justify="center" className={classes.main} spacing={4}>
        <Grid item>
          <Typography variant="h6">Personal finances tracker</Typography>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={4} className={classes.main}>
        <Grid item>
          <Link to="/categorias">
            <Button>Categorias</Button>
          </Link>
        </Grid>
        <Grid item>
          <Link to="/historico">
            <Button>Histórico</Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={4} className={classes.main}>
        <Grid item xs={10} md={8} lg={4}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              Nova entrada
            </Typography>
          </Grid>
          <Box height="15px" />
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <YearPicker onChange={updateField} value={year} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MonthPicker onChange={updateField} value={month} />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <AmountPicker onChange={updateField} value={amount} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={categories || []}
                  getOptionLabel={option => option.name}
                  inputValue={fromInput}
                  onInputChange={(event, value) => {
                    dispatch({ type: 'UPDATE_INPUT', payload: { name: 'fromInput', value } });
                  }}
                  onChange={(event, value) => {
                    dispatch({ type: 'UPDATE_VALUE', payload: { name: 'from', value } });
                  }}
                  value={values.from}
                  renderInput={params => <TextField {...params} label="Da categoria" variant="outlined" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={categories || []}
                  getOptionLabel={option => option.name}
                  inputValue={toInput}
                  onInputChange={(event, value) => {
                    dispatch({ type: 'UPDATE_INPUT', payload: { name: 'toInput', value } });
                  }}
                  onChange={(event, value) => {
                    dispatch({ type: 'UPDATE_VALUE', payload: { name: 'to', value } });
                  }}
                  value={values.to}
                  renderInput={params => (
                    <TextField {...params} label="Para a categoria" variant="outlined" />
                  )}
                />
              </Grid>
              {!isEmpty(error) && <ErrorMessage message={error} />}
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item>
                    <Button onClick={saveLog}>Guardar</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={4} className={classes.main}>
        <Grid item xs={10} md={6} lg={3}>
          {isLoading ? (
            <Typography align="center" variant="h6">
              A carregar logs
            </Typography>
          ) : (
            logs.map(log => <LogEntry key={log._id} log={log} />)
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Main;
