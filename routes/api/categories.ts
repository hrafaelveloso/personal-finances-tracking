import { Router, Response } from 'express';
import Category from '../../models/Category';
import authenticateJWT from '../../utils/authenticateJWT';
import { RequestWithUserId } from '../../src/interfaces';
import mongoose from 'mongoose';

const router = Router();

// ! GET REQUESTS
router.get('/', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;

  Category.find({ userId: mongoose.Types.ObjectId(userId) }, 'name')
    .populate({ path: 'parent', select: 'name' })
    .sort({ name: 1 })
    .then(docs => {
      return res.status(200).json(docs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar categorias.',
        err: JSON.stringify(err),
      });
    });
});

// ! POST REQUESTS
router.post('/', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;

  const newCategory = new Category(req.body);
  newCategory.userId = mongoose.Types.ObjectId(userId);

  newCategory
    .save()
    .then(saved => {
      return res.status(201).json(saved);
    })
    .catch(err => {
      return res.status(404).json({
        response: false,
        message: 'Erro ao guardar a nova categoria.',
        err: JSON.stringify(err),
      });
    });
});

// ! PUT REQUESTS
router.put('/', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;
  const { _id, name }: { _id?: any; name?: string } = req.body;

  Category.findOne({ _id, userId: mongoose.Types.ObjectId(userId) })
    .then(doc => {
      doc.name = name;
      doc
        .save()
        .then(saved => {
          return res.status(200).json(saved);
        })
        .catch(err => {
          return res.status(400).json({
            response: false,
            message: 'Erro ao atualizar a categoria',
            err: JSON.stringify(err),
          });
        });
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar a categoria',
        err: JSON.stringify(err),
      });
    });
});

export default router;
