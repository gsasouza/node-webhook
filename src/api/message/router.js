const Router = require('koa-router');
const { create } = require('./message');

module.exports = () => {
  const router = new Router({prefix: 'messages'});
  router
    .get('/', (ctx) => ctx.body = 'Here')
    .post('/', create);

  return router;
};
