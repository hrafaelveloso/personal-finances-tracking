import { Router, Response } from 'express';
import Category from '../../models/Category';
import Log from '../../models/Log';
import isEmpty from '../../utils/isEmpty';
import isObjectId from '../../utils/isObjectId';
import authenticateJWT from '../../utils/authenticateJWT';
import { RequestWithUserId } from '../../src/interfaces';
import mongoose from 'mongoose';

const router = Router();

// ! GET REQUESTS
router.get('/', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;

  Log.find({ userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .sort({ updatedAt: -1 })
    .then(docs => {
      return res.status(200).json(docs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar registos.',
        err: JSON.stringify(err),
      });
    });
});

router.get('/last', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;

  Log.find({ userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .limit(10)
    .sort({ updatedAt: -1 })
    .then(docs => {
      return res.status(200).json(docs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar registos.',
        err: JSON.stringify(err),
      });
    });
});

// @ All logs from category
router.get('/:category', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { category } = req.params;
  const { userId } = req;

  Category.findOne(
    {
      $or: [{ name: category }, { _id: isObjectId(category) ? category : null }],
      userId: mongoose.Types.ObjectId(userId),
    },
    'name'
  )
    .then(catDoc => {
      if (!catDoc) {
        return res.status(404).json({
          response: false,
          message: 'Categoria inexistente.',
          err: null,
        });
      }
      Log.find({ to: catDoc._id, userId: mongoose.Types.ObjectId(userId) }, 'from amount date')
        .populate({ path: 'from', select: 'name' })
        .then(inLogsDocs => {
          Log.find({ from: catDoc._id, userId: mongoose.Types.ObjectId(userId) }, 'to amount date')
            .populate({ path: 'to', select: 'name' })
            .then(outLogsDocs => {
              const totalIn = inLogsDocs.reduce((acc, cur) => {
                const total = acc + cur.amount;
                return total;
              }, 0);

              const totalOut = outLogsDocs.reduce((acc, cur) => {
                const total = acc + cur.amount;
                return total;
              }, 0);

              const inLogs = inLogsDocs.reduce((acc, cur) => {
                const { name } = cur.from;

                acc[name] = acc[name] || { logs: [], total: 0 };
                acc[name].logs.push(cur);
                acc[name].total += cur.amount;

                return acc;
              }, {});

              const outLogs = outLogsDocs.reduce((acc, cur) => {
                const { name } = cur.to;

                acc[name] = acc[name] || { logs: [], total: 0 };
                acc[name].logs.push(cur);
                acc[name].total += cur.amount;

                return acc;
              }, {});

              return res.status(200).json({
                totalIn,
                totalOut,
                category: catDoc,
                logs: { in: inLogs, out: outLogs },
              });
            });
        });
    })
    .catch(err => {
      return res.status(404).json({
        response: false,
        message: 'Erro ao procurar a categoria.',
        err: JSON.stringify(err),
      });
    });
});

// ! POST REQUESTS
router.post('/', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { userId } = req;
  const { from, to } = req.body;

  if (!isEmpty(from) && !isEmpty(to)) {
    Category.findOne({
      $or: [{ name: from }, { _id: isObjectId(from) ? from : null }],
      userId: mongoose.Types.ObjectId(userId),
    })
      .then(fromCat => {
        if (!fromCat) {
          return res.status(404).json({
            response: false,
            message: 'Categoria `from` inexistente.',
            err: null,
          });
        }

        Category.findOne({
          $or: [{ name: to }, { _id: isObjectId(to) ? to : null }],
          userId: mongoose.Types.ObjectId(userId),
        })
          .then(toCat => {
            if (!toCat) {
              return res.status(404).json({
                response: false,
                message: 'Categoria `to` inexistente.',
                err: null,
              });
            }

            // @ From and to categories exist
            const newLog = new Log(req.body);

            newLog.from = fromCat._id;
            newLog.to = toCat._id;
            newLog.userId = mongoose.Types.ObjectId(userId);

            newLog
              .save()
              .then(saved => {
                saved
                  .populate({ path: 'from', select: 'name' })
                  .populate({ path: 'to', select: 'name' })
                  .execPopulate()
                  .then(populated => {
                    return res.status(201).json(populated);
                  });
              })
              .catch(err => {
                return res.status(404).json({
                  response: false,
                  message: 'Erro ao guardar o novo registo.',
                  err: JSON.stringify(err),
                });
              });
          })
          .catch(err => {
            return res.status(404).json({
              response: false,
              message: 'Erro ao procurar documento da categoria `to` deste log.',
              err: JSON.stringify(err),
            });
          });
      })
      .catch(err => {
        return res.status(404).json({
          response: false,
          message: 'Erro ao procurar documento da categoria `from` deste log.',
          err: JSON.stringify(err),
        });
      });
  } else {
    return res.status(400).json({
      response: false,
      message: 'É necessário inserir a categoria `from` e a categoria `to`.',
      err: null,
    });
  }
});

// ! DELETE REQUESTS
router.delete('/:_id', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { _id } = req.params;

  Log.deleteOne({ _id: mongoose.Types.ObjectId(_id) })
    .then(deleted => {
      return res.status(200).json(deleted);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao apagar registo.',
        err: JSON.stringify(err),
      });
    });
});

export default router;
