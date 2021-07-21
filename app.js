/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const { logError, returnError} = require('./middleware/errorHandler')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yml');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */

const userController = require('./controllers/user');
const accountController = require('./controllers/account');
const transactionController = require('./controllers/transaction');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */

 app.use('/api-docs', swaggerUi.serve);
 app.get('/api-docs', swaggerUi.setup(swaggerDocument))

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





app.post('/v1/users/:id/account',userController.postCreateAccount);
app.get('/v1/account/balance/fetch',accountController.getFetchBalances);
app.post('/v1/transaction',transactionController.postDoTransaction);
app.get('/v1/transaction/history',transactionController.getfetchTransactionHistory);
app.post('/v1/users',userController.postCreateUser);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(logError)
  app.use(returnError)
} else {
 
  app.use(logError)
  app.use(returnError)
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
