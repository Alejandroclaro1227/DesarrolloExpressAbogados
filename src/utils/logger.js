const config = require('../config/config');

/**
 * Logger Implementation
 */
class Logger {
  constructor() {
    this.isDevelopment = config.nodeEnv === 'development';
  }

  _formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    };

    if (this.isDevelopment) {
      // Pretty print in development
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
      if (Object.keys(meta).length > 0) {
        console.log('Meta:', JSON.stringify(meta, null, 2));
      }
    } else {
      // JSON format in production
      console.log(JSON.stringify(logEntry));
    }
  }

  info(message, meta = {}) {
    this._formatMessage('info', message, meta);
  }

  error(message, meta = {}) {
    this._formatMessage('error', message, meta);
  }

  warn(message, meta = {}) {
    this._formatMessage('warn', message, meta);
  }

  debug(message, meta = {}) {
    if (this.isDevelopment) {
      this._formatMessage('debug', message, meta);
    }
  }

  /**
   * Log HTTP requests
   */
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    };

    if (res.statusCode >= 400) {
      this.error('HTTP Request Error', logData);
    } else {
      this.info('HTTP Request', logData);
    }
  }

  /**
   * Log database operations
   */
  logDatabase(operation, table, duration, meta = {}) {
    this.debug('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta,
    });
  }
}

// Export singleton instance
module.exports = new Logger();
