import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

export interface PostI {
  identifier: string;
  title: string;
  content: string;
  postedAt: Date;
  deleteCode: string;
}

const PostSchema = new Schema<PostI>({
  identifier: {
    type: String,
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
  },
});

PostSchema.pre('save', function presave(next) {
  if (this.isNew) {
    this.identifier = nanoid(8);
    this.deleteCode = nanoid();
  }

  next();
});

export default model<PostI>('Post', PostSchema);
