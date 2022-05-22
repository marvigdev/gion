import Router from 'koa-router';
import PostController from '../controllers/PostController';

const _ = new Router({ prefix: '/posts' });

_.get('/:postId', PostController.getById);

export default _;
