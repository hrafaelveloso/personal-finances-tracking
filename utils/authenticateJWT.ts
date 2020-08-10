import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUserId, IUser } from '../src/interfaces';

const authenticateJWT = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.SECRET_OR_KEY, (err, user: IUser) => {
      if (err) {
        return res.status(403).json({ message: 'Utilizador inexistente ou token inválido.', err: null });
      }

      req.userId = user._id;
      next();
    });
  } else {
    return res.status(403).json({ message: 'Utilizador inexistente ou token inválido.', err: null });
  }
};

export default authenticateJWT;
