import { Router, Request, Response } from 'express';
import isEmpty from '../../utils/isEmpty';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {
    return res.status(403).json({ message: 'Pedido inválido.', err: null });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(403).json({ message: 'Utilizador não encontrado', err: null });
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = { _id: user._id, email: user.email };

          jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 86400 }, (err, token) => {
            res.status(200).json({ success: true, token });
          });
        } else {
          return res.status(403).json({ message: 'Utilizador não encontrado', err: null });
        }
      });
    })
    .catch(err => {
      return res.status(403).json({ message: 'Utilizador não encontrado', err });
    });
});

router.post('/register', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {
    return res.status(403).json({ message: 'Pedido inválido', err: null });
  }

  const newUser = new User(req.body);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return res.status(403).json({ message: 'Erro ao criar utilizador', err });
      }

      newUser.password = hash;

      newUser
        .save()
        .then(user => {
          return res.status(200).json(user);
        })
        .catch(err => {
          return res.status(403).json({ message: 'Erro ao criar utilizador', err });
        });
    });
  });
});

export default router;
