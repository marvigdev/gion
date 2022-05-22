import { Context } from 'koa';
import PostService from '../services/PostService';

abstract class PostController {
  static async getById(ctx: Context) {
    const postId = ctx.params.postId as string;

    const [post] = await PostService.getById(postId);

    if (!post) {
      ctx.status = 404;
      ctx.body = { errorCode: 'POST/NOT_FOUND' };
    } else {
      const { identifier, title, content } = post;
      ctx.body = { identifier, title, content };
    }
  }
}

export default PostController;
