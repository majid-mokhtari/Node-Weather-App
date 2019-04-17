require('./config/config');
const express = require('express');
const cors = require('cors');
const { mongoose } = require('./db/mongoose');
const userRouter = require('./router/user');
const todosRouter = require('./router/todos');
const weatherRouter = require('./router/weather');

const port = process.env.PORT;

const app = express();

app.use(cors({ exposedHeaders: 'token' }));
app.use(express.json());
app.use(userRouter);
app.use(todosRouter);
app.use(weatherRouter);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
