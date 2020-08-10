import mongoose, { Document, Schema } from 'mongoose';
import timestamp from '../utils/timestamp';
import { ILog } from '../src/interfaces';

interface ILogModel extends ILog, Document {}

const { ObjectId } = Schema.Types;

const LogSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    from: { type: ObjectId, ref: 'Category', required: true },
    to: { type: ObjectId, ref: 'Category', required: true },
    userId: { type: ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: {
      currentTime: () => timestamp(),
    },
  }
);

export default mongoose.model<ILogModel>('Log', LogSchema, 'logs');
