import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface Post {
  identifier: string;
  title: string;
  content: string;
  postedAt: Date;
  deleteCode?: string;
}

const PostSchema = new Schema<Post>({
  identifier: {
    type: String,
    default: () => nanoid(8),
    index: true,
  },
  title: {
    type: String,
    default: 'Untitled post',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  deleteCode: {
    type: String,
    default: nanoid,
  },
});

export default model<Post>('Post', PostSchema);
