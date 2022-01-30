const logger = require('./utils/logger');
const config = require('./config')
process.on('uncaughtException', error => { logger.error(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`)});

const app = require('./app');
app.listen(parseInt(config.PORT), console.log('Listening on', parseInt(config.PORT)));


