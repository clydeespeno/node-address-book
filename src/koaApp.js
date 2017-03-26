import Koa from 'koa';
import bodyparser from 'koa-bodyparser';

export default ({addressbookRouter, config}) => {
  const app = new Koa();

  app.use(bodyparser());
  app.use(addressbookRouter.routes());

  const server = app.listen(config.port);

  return {
    app,
    server
  };
};
