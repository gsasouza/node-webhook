const Router = require('koa-router');

const messageRouter = require('../../../api/message/router')();

module.exports = () => {
  const rootRouter = new Router({ prefix: '/api' });
  rootRouter.use('/', messageRouter.routes(), messageRouter.allowedMethods());

  return rootRouter.routes();
};
