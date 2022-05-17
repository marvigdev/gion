import './helpers/loadEnvironmentVariables';
import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import KoaLogger from 'koa-logger';

const app = new Koa();

app.use(KoaLogger());
app.use(json());
app.use(bodyParser());

export default app;
