const errorHandler = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = {
      message: 'Error',
      error,
    };
  }
};

module.exports = errorHandler;
