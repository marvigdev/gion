import { PostI } from '../models/Post';

abstract class PostService {
  static async getById(...posts: string[]): Promise<PostI[]> {
    return [];
  }
}

export default PostService;
