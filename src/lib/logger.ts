export const logger = {
  info: (message: string, data?: object) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        ...data,
        timestamp: new Date().toISOString(),
      })
    )
  },
  error: (message: string, error?: unknown, data?: object) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
        ...data,
        timestamp: new Date().toISOString(),
      })
    )
  },
  warn: (message: string, data?: object) => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        ...data,
        timestamp: new Date().toISOString(),
      })
    )
  },
}
