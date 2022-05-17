import Post, { PostI } from '../models/Post';

abstract class PostService {
  static async getById(...posts: string[]): Promise<PostI[]> {
    const foundPosts = await Post.find({ identifier: { $in: posts } });
    return foundPosts;
  }
}

export default PostService;
