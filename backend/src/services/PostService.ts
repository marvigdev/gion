import { HydratedDocument } from 'mongoose';
import Post, { PostI } from '../models/Post';

export interface CreatePostProps {
  title?: string;
  content: string;
}

abstract class PostService {
  static async getById(...posts: string[]): Promise<HydratedDocument<PostI>[]> {
    const foundPosts = await Post.find({ identifier: { $in: posts } });
    return foundPosts;
  }

  static async create({
    title,
    content,
  }: CreatePostProps): Promise<HydratedDocument<PostI>> {
    const newPost = new Post({ title, content });
    await newPost.save();
    return newPost;
  }

  static async delete(
    postId: string,
    deleteCode: string,
  ): Promise<HydratedDocument<PostI> | null> {
    const [post] = await this.getById(postId);
    if (!post) return null;
    if (post.deleteCode !== deleteCode) return null;

    await post.delete();
    return post;
  }
}

export default PostService;
