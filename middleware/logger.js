const morgan = require('morgan');

const logger = process.env.NODE_ENV === 'development' ? morgan('dev') : morgan('combined');

module.exports = logger;
