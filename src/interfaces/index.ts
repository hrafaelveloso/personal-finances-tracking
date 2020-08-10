import { Request } from 'express';

export interface ICategory {
  _id: any;
  name: string;
  userId: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILog {
  _id: any;
  amount: number;
  date: Date;
  from: ICategory;
  to: ICategory;
  userId: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: any;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUserId extends Request {
  userId: string;
}
