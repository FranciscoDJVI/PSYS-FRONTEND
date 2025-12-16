const apiLogger = {
  request: (config) => {
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      requestId: config.metadata?.requestId
    });
  },

  response: (response, duration) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`, {
      data: response.data,
      requestId: response.config.metadata?.requestId
    });
  },

  error: (error, metadata = {}) => {
    const config = error.config || {};
    const status = error.response?.status;
    const message = error.message;
    const url = config.url;
    const method = config.method?.toUpperCase();

    console.error(`[API ERROR] ${method} ${url} - ${status || 'NETWORK'} ${message}`, {
      ...metadata,
      requestId: config.metadata?.requestId,
      response: error.response?.data
    });
  },

  performance: (data) => {
    console.warn('[API PERFORMANCE]', data);
  },

  calculateResponseSize: (data) => {
    try {
      return JSON.stringify(data).length;
    } catch {
      return 0;
    }
  }
};

export { apiLogger };
