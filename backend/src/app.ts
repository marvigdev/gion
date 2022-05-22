import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import KoaLogger from 'koa-logger';
import PostRoutes from './routes/PostRoutes';

const app = new Koa();

app.use(KoaLogger());
app.use(json());
app.use(bodyParser());

app.use(PostRoutes.routes());
app.use(PostRoutes.allowedMethods());

export default app;
