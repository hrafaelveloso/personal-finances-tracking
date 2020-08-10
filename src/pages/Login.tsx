import React, { useState } from 'react';
import HeaderLabelButton from '../components/HeaderLabelButton';
import { Grid, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import setAuthToken from '../utils/setAuthToken';

const Main: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const res = await axios.post('/users/login', { email, password });
      const { token } = res.data;

      localStorage.setItem('jwtToken', token);

      setAuthToken(token);

      window.location.reload();
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <HeaderLabelButton label="Login" noButton spacing={4} />
      <Grid container spacing={5} justify="center">
        <Grid item xs={11} md={7} lg={4}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={5} justify="center">
        <Grid item xs={11} md={7} lg={4}>
          <TextField
            fullWidth
            type="password"
            label="Palavra-passe"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
      </Grid>
      {error && <ErrorMessage message={error} />}
      <Grid container spacing={5} justify="center">
        <Grid item>
          <Button onClick={login}>Login</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Main;
