const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creando directorio de logs:', error);
}

class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
    this.errorFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString =
      Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}\n`;
  }

  writeToFile(file, message) {
    try {
      fs.appendFileSync(file, message);
    } catch (error) {
      console.error('Error escribiendo al archivo de log:', error);
    }
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('info', message, meta);

    if (process.env.NODE_ENV !== 'test') {
      console.log(`ℹ️  ${message}`);
    }

    this.writeToFile(this.logFile, formattedMessage);
  }

  error(message, meta = {}) {
    const formattedMessage = this.formatMessage('error', message, meta);

    if (process.env.NODE_ENV !== 'test') {
      console.error(`❌ ${message}`);
    }

    this.writeToFile(this.logFile, formattedMessage);
    this.writeToFile(this.errorFile, formattedMessage);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('warn', message, meta);

    if (process.env.NODE_ENV !== 'test') {
      console.warn(`⚠️  ${message}`);
    }

    this.writeToFile(this.logFile, formattedMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.log(`🐛 ${message}`);
      this.writeToFile(this.logFile, formattedMessage);
    }
  }

  // Method to clean old logs
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          this.info(`Log antiguo eliminado: ${file}`);
        }
      });
    } catch (error) {
      this.error('Error limpiando logs antiguos:', { error: error.message });
    }
  }
}

module.exports = new Logger();
