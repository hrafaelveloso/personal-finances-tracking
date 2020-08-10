import axios from 'axios';

const setAuthToken = (token: string) => {
  if (token) {
    // * Todos os pedidos são feitos com o token [Authorization Bearer]
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;
