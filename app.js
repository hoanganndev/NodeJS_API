//Config environment
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const secureApp = require('helmet');
const mongoClient = require('mongoose');
const userRouter = require('./routes/user');
const deckRouter = require('./routes/deck');


//TODO: Setup mongodb by mongoose
mongoClient.connect('mongodb://localhost/nodejsapistarter', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected database from mongodb.'))
  .catch((error) => console.error(`❌ Connect database is failed with error which is ${error}`))

const app = express();
app.use(secureApp());

//TODO: Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//TODO: Routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Server is OK'
  })
});
app.use('/users', userRouter);
app.use('/decks', deckRouter);


//TODO: Catch 404 errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('⚠ Not Found');
  err.status = 404;
  next(err);
});

//TODO: Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500;
  //Response to client
  return res.status(status).json({
    error: {
      message: error.message
    }
  })
})

//TODO:Start server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`💚💚💚 sever is listening on port ${port}💚💚💚`))