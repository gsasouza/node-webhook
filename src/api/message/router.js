const Router = require('koa-router');
const { create } = require('./message');

module.exports = () => {
  const router = new Router({prefix: 'messages'});
  router
    .post('/', create);

  return router;
};
