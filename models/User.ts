import mongoose, { Document, Schema } from 'mongoose';
import timestamp from '../utils/timestamp';
import { IUser } from '../src/interfaces';

interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      currentTime: () => timestamp(),
    },
  }
);

export default mongoose.model<IUserModel>('User', UserSchema, 'users');
