import dotenv from 'dotenv';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  dotenv.config();
}

import path from 'path';
import express from 'express';

const app = express();

/* eslint-disable no-console */

import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import formatDate from './utils/formatDate';

const port = isDev ? parseInt(process.env.SERVER_PORT, 10) : parseInt(process.env.PORT, 10) || 4000;

// @ Rotas
import categories from './routes/api/categories';
import logs from './routes/api/logs';
import graphs from './routes/api/graphs';
import users from './routes/api/users';

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`${formatDate(new Date())} - Ligação estabelecida com a Base de Dados.`);
  })
  .catch(err => {
    if (err.name === 'MongoNetworkError') {
      console.log(err);
      console.log(`${formatDate(new Date())} - Ligação com a Base de Dados perdida.`);
    } else {
      console.dir(err);
    }
  });

app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
app.use(bodyParser.json());
app.use(cors());

// @ Use routes
app.use('/api/categories', categories);
app.use('/api/logs', logs);
app.use('/api/graphs', graphs);
app.use('/api/users', users);

// app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
