const Koa = require('koa');
const koaBody = require('koa-body');

const errorHandlerMiddleware = require('../core/middlewares/errorHandler');
const routerMiddleware = require('../core/middlewares/router/router');
const { PRODUCER_PORT } = require('../config/environment');

const app = new Koa();

app.use(errorHandlerMiddleware());
app.use(koaBody());
app.use(routerMiddleware());

app.listen(PRODUCER_PORT, () => console.log(`Producer Listening on ${PRODUCER_PORT}`));
