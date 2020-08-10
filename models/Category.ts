import mongoose, { Document, Schema } from 'mongoose';
import timestamp from '../utils/timestamp';
import { ICategory } from '../src/interfaces';

interface ICategoryModel extends ICategory, Document {}

const { ObjectId } = Schema.Types;

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    userId: { type: ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: {
      currentTime: () => timestamp(),
    },
  }
);

export default mongoose.model<ICategoryModel>('Category', CategorySchema, 'categories');
