import React, { useCallback, useReducer } from 'react';
import { makeStyles, Grid, Typography, Button, Paper, Box, Divider } from '@material-ui/core';
import isEmpty from '../utils/isEmpty';
import axios from 'axios';
import { getYear, getMonth, isAfter } from 'date-fns';
import Chart from 'react-google-charts';
import formatDate from '../utils/formatDate';
import ErrorMessage from '../components/ErrorMessage';
import HeaderLabelButton from '../components/HeaderLabelButton';
import YearMonthPicker from '../components/YearMonthPicker';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import pt from 'date-fns/locale/pt';
import { addMonths } from 'date-fns/esm';

const useStyles = makeStyles(
  () => ({
    main: {
      marginTop: '50px',
    },
    paper: {
      padding: '20px',
    },
  }),
  { name: 'Categories' }
);

const reducer = (state, action) => {
  switch (action.type) {
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
    case 'NO_DATA':
      return {
        ...state,
        noData: action.value,
      };
    case 'TOGGLE_INTERVAL':
      return {
        ...state,
        interval: !state.interval,
      };
    case 'CLEAR_STATE':
      return {
        ...state,
        year: getYear(new Date()),
        month: getMonth(new Date()) + 1,
        year2: getYear(new Date()),
        month2: getMonth(new Date()) + 3,
        interval: false,
        dataBar: null,
        optionsBar: null,
        dataSankey: null,
        optionsSankey: null,
        error: '',
        noData: '',
      };
    default:
      return state;
  }
};

const defaultChartProps = {
  width: '100%',
  height: '600px',
  loader: (
    <Typography variant="h6" align="center">
      A carregar gráfico
    </Typography>
  ),
};

const History: React.FC = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    year: getYear(new Date()),
    month: getMonth(new Date()) + 1,
    year2: getYear(new Date()),
    month2: getMonth(new Date()) + 3,
    interval: false,
    dataBar: null,
    optionsBar: null,
    dataSankey: null,
    optionsSankey: null,
    error: '',
    noData: '',
  });

  const {
    year,
    month,
    year2,
    month2,
    error,
    dataBar,
    optionsBar,
    dataSankey,
    optionsSankey,
    noData,
    interval,
  } = state;

  const updateField = useCallback(e => {
    dispatch({ type: 'UPDATE_FIELD', payload: { name: e.target.name, value: e.target.value } });
  }, []);

  const cleanErrorAndData = useCallback(() => {
    dispatch({ type: 'SET_ERROR', value: '' });
    dispatch({ type: 'NO_DATA', value: '' });
  }, []);

  const splitBarAndSankeyData = useCallback(data => {
    const { bar, sankey } = data;

    const graphBar = Object.keys(bar).reduce(
      (acc, cur) => {
        const obj = bar[cur];

        if (obj.totalIn !== obj.totalOut) {
          acc.push([cur, obj.totalIn, obj.totalOut]);
        }

        return acc;
      },
      [['', 'Entrada', 'Saída']]
    );

    const graphSankey = sankey.reduce(
      (acc, cur) => {
        acc.push([cur.from, cur.to, cur.amount]);

        return acc;
      },
      [['De', 'Para', 'Montante']]
    );

    return { graphBar, graphSankey };
  }, []);

  const loadGraphInfo = useCallback((info: IGraphInfo) => {
    const { sankeyData, barData, sankeyOptions, barOptions } = info;
    dispatch({ type: 'UPDATE_FIELD', payload: { name: 'dataSankey', value: sankeyData } });
    dispatch({ type: 'UPDATE_FIELD', payload: { name: 'optionsSankey', value: sankeyOptions } });
    dispatch({ type: 'UPDATE_FIELD', payload: { name: 'dataBar', value: barData } });
    dispatch({ type: 'UPDATE_FIELD', payload: { name: 'optionsBar', value: barOptions } });
  }, []);

  const getSingleMonthData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    cleanErrorAndData();

    try {
      const res = await axios.get(`/graphs/both/${year}/${month}`);
      const { sankey } = res.data;

      if (sankey.length > 0) {
        const { graphBar, graphSankey } = splitBarAndSankeyData(res.data);

        const info = {
          sankeyData: graphSankey,
          barData: graphBar,
          sankeyOptions: {},
          barOptions: {
            chart: {
              title: 'Relatório mensal',
              subtitle: `Despesas em ${formatDate(new Date(year, month, 0), "LLLL 'de' yyyy")}`,
            },
          },
        };

        loadGraphInfo(info);
      } else {
        dispatch({
          type: 'NO_DATA',
          value: `Nenhuma entrada em ${formatDate(new Date(year, month, 0), "LLLL 'de' yyyy")}`,
        });
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        dispatch({ type: 'SET_ERROR', value: err.response.data.message });
      }
    }
  };

  const getIntervalData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    cleanErrorAndData();
    const date1 = new Date(year, month, 0);
    const date2 = new Date(year2, month2, 0);

    if (isAfter(date2, date1)) {
      try {
        const res = await axios.get(`/graphs/both/${year}/${month}/${year2}/${month2}`);
        const { sankey } = res.data;

        if (sankey.length > 0) {
          const { graphBar, graphSankey } = splitBarAndSankeyData(res.data);

          const info = {
            sankeyData: graphSankey,
            barData: graphBar,
            sankeyOptions: {},
            barOptions: {
              chart: {
                title: `Relatório de ${formatDistanceStrict(
                  new Date(year, month, 0),
                  addMonths(new Date(year2, month2, 0), 1),
                  { locale: pt }
                )}`,
                subtitle: `Despesas entre ${formatDate(
                  new Date(year, month, 0),
                  "LLLL 'de' yyyy"
                )} e ${formatDate(new Date(year2, month2, 0), "LLLL 'de' yyyy")}.`,
              },
            },
          };

          loadGraphInfo(info);
        } else {
          dispatch({
            type: 'NO_DATA',
            value: `Nenhuma entrada em ${formatDate(new Date(year, month, 0), "LLLL 'de' yyyy")}`,
          });
        }
      } catch (err) {
        if (err?.response?.data?.message) {
          dispatch({ type: 'SET_ERROR', value: err.response.data.message });
        }
      }
    } else {
      dispatch({ type: 'SET_ERROR', value: 'A data do 2º intervalo é inferior ou igual à primeira.' });
    }
  };

  return (
    <>
      <HeaderLabelButton label="Histórico" spacing={4} />
      <Grid container justify="center" spacing={4} className={classes.main}>
        <Grid item xs={10} md={6} lg={4}>
          <YearMonthPicker onChange={updateField} yearValue={year} monthValue={month} />
          {interval && (
            <>
              <Box height="20px" />
              <YearMonthPicker
                onChange={updateField}
                yearValue={year2}
                monthValue={month2}
                yearName="year2"
                monthName="month2"
              />
            </>
          )}
          <Box height="20px" />
          <Grid container justify="space-between" spacing={2}>
            <Grid item>
              <Button
                variant="text"
                onClick={e => {
                  e.preventDefault();
                  dispatch({ type: 'TOGGLE_INTERVAL' });
                }}
              >
                {interval ? 'Remover' : 'Adicionar'} intervalo
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={interval ? getIntervalData : getSingleMonthData}>Filtrar</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {!isEmpty(error) && <ErrorMessage message={error} />}
      <Grid container justify="center" spacing={4}>
        <Grid item xs={11} lg={9}>
          {!isEmpty(noData) ? (
            <Typography variant="h6" align="center">
              {noData}
            </Typography>
          ) : isEmpty(dataBar) ? (
            <Typography variant="h6" align="center">
              Filtragem não efetuada...
            </Typography>
          ) : (
            <Paper className={classes.paper}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} id="barGraph">
                    <Chart {...defaultChartProps} chartType="Bar" data={dataBar} options={optionsBar} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} id="sankeyGraph">
                    <Chart
                      {...defaultChartProps}
                      chartType="Sankey"
                      data={dataSankey}
                      options={optionsSankey}
                    />
                  </Grid>
                </Grid>
              </>
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
};

interface IGraphInfo {
  sankeyData: any;
  barData: any;
  sankeyOptions: any;
  barOptions: any;
}

export default History;
