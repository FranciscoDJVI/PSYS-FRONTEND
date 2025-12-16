const logger = {
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  info: (...args) => {
    console.info('[INFO]', ...args);
  },
};

export default logger;