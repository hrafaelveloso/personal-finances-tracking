import React, { useCallback } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { SWRConfig } from 'swr';
import theme from './utils/theme/theme';
import setAuthToken from './utils/setAuthToken';
import jwtDecode from 'jwt-decode';

// @ Pages
import Main from './pages/Main';
import Categories from './pages/Categories';
import History from './pages/History';
import Login from './pages/Login';

import { Grid, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(
  () => ({
    button: {
      marginTop: '10px',
    },
  }),
  { name: 'App' }
);

const routes = [
  { id: '01', path: '/', component: Main },
  { id: '02', path: '/categorias', component: Categories },
  { id: '03', path: '/historico', component: History },
];

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const fetcher = (url: string) =>
  axios(url)
    .then(res => res.data)
    .catch(err => err);

if (localStorage.getItem('jwtToken')) {
  setAuthToken(localStorage.getItem('jwtToken'));
  const decoded: any = jwtDecode(localStorage.getItem('jwtToken'));

  // * Check if token is valid
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    localStorage.removeItem('jwtToken');

    // * Redirect to main page
    window.location.href = '/';
  }
}

const App: React.FC = () => {
  const classes = useStyles();
  const hasToken = localStorage.getItem('jwtToken');

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    setAuthToken(null);
    window.location.href = '/';
  }, []);

  return (
    <SWRConfig value={{ fetcher }}>
      <ThemeProvider theme={theme}>
        {hasToken && (
          <Grid container justify="flex-end" spacing={4} className={classes.button}>
            <Grid item>
              <Button onClick={logout}>Logout</Button>
            </Grid>
          </Grid>
        )}
        <CssBaseline />
        <Router>
          {hasToken ? (
            routes.map(route => <Route key={route.id} exact {...route} />)
          ) : (
            <Route path="*" component={Login} />
          )}
        </Router>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
