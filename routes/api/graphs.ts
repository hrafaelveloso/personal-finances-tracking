import { Router, Response } from 'express';
import Log from '../../models/Log';
import authenticateJWT from '../../utils/authenticateJWT';
import { RequestWithUserId } from '../../src/interfaces';
import mongoose from 'mongoose';

const router = Router();

router.get('/bar/:year/:month', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { year, month } = req.params;
  const { userId } = req;

  const date1 = new Date(parseInt(year, 10), parseInt(month, 10), 0);
  const date2 = new Date(parseInt(year, 10), parseInt(month, 10), 28);

  Log.find({ date: { $gt: date1, $lt: date2 }, userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .sort({ updatedAt: -1 })
    .then(docs => {
      const orgLogs = docs.reduce((acc, cur) => {
        const { name: fromName } = cur.from;
        const { name: toName } = cur.to;
        acc[fromName] = acc[fromName] || { totalOut: 0, totalIn: 0 };
        acc[toName] = acc[toName] || { totalOut: 0, totalIn: 0 };

        acc[fromName].totalOut += cur.amount;
        acc[toName].totalIn += cur.amount;

        return acc;
      }, {});

      return res.status(200).json(orgLogs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar categorias.',
        err: JSON.stringify(err),
      });
    });
});

router.get('/sankey/:year/:month', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { year, month } = req.params;
  const { userId } = req;

  const date1 = new Date(parseInt(year, 10), parseInt(month, 10), 0);
  const date2 = new Date(parseInt(year, 10), parseInt(month, 10), 28);

  Log.find({ date: { $gt: date1, $lt: date2 }, userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .sort({ updatedAt: -1 })
    .then(docs => {
      const orgLogs = docs.reduce((acc, cur) => {
        const { from, to, amount } = cur;

        const obj = {
          from: from.name,
          to: to.name,
          amount,
        };

        acc.push(obj);

        return acc;
      }, []);

      return res.status(200).json(orgLogs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar categorias.',
        err: JSON.stringify(err),
      });
    });
});

router.get('/both/:year/:month', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { year, month } = req.params;
  const { userId } = req;

  const date1 = new Date(parseInt(year, 10), parseInt(month, 10), 0);
  const date2 = new Date(parseInt(year, 10), parseInt(month, 10), 28);

  Log.find({ date: { $gt: date1, $lt: date2 }, userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .sort({ updatedAt: -1 })
    .then(docs => {
      const graphs = docs.reduce(
        (acc, cur) => {
          // @ Bar graph
          const {
            from: { name: fromName },
            to: { name: toName },
            amount,
          } = cur;
          acc.bar[fromName] = acc.bar[fromName] || { totalOut: 0, totalIn: 0 };
          acc.bar[toName] = acc.bar[toName] || { totalOut: 0, totalIn: 0 };

          acc.bar[fromName].totalOut += cur.amount;
          acc.bar[toName].totalIn += cur.amount;

          // @ Sankey graph
          const newObj = { from: fromName, to: toName, amount };
          const newObjIdx = acc.sankey.findIndex(item => item.from === newObj.from && item.to === newObj.to);

          if (newObjIdx !== -1) {
            // @ New object already exists
            acc.sankey[newObjIdx].amount += amount;

            return acc;
          }

          acc.sankey.push(newObj);

          return acc;
        },
        { bar: {}, sankey: [] }
      );

      return res.status(200).json(graphs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar categorias.',
        err: JSON.stringify(err),
      });
    });
});

router.get('/both/:year/:month/:year2/:month2', authenticateJWT, (req: RequestWithUserId, res: Response) => {
  const { year, month, year2, month2 } = req.params;
  const { userId } = req;

  const date1 = new Date(parseInt(year, 10), parseInt(month, 10), 1);
  const date2 = new Date(parseInt(year2, 10), parseInt(month2, 10), 28);

  Log.find({ date: { $gt: date1, $lt: date2 }, userId: mongoose.Types.ObjectId(userId) })
    .populate({ path: 'from', select: 'name' })
    .populate({ path: 'to', select: 'name' })
    .sort({ updatedAt: -1 })
    .then(docs => {
      const graphs = docs.reduce(
        (acc, cur) => {
          // @ Bar graph
          const {
            from: { name: fromName },
            to: { name: toName },
            amount,
          } = cur;
          acc.bar[fromName] = acc.bar[fromName] || { totalOut: 0, totalIn: 0 };
          acc.bar[toName] = acc.bar[toName] || { totalOut: 0, totalIn: 0 };

          acc.bar[fromName].totalOut += cur.amount;
          acc.bar[toName].totalIn += cur.amount;

          // @ Sankey graph
          const newObj = { from: fromName, to: toName, amount };
          const newObjIdx = acc.sankey.findIndex(item => item.from === newObj.from && item.to === newObj.to);

          if (newObjIdx !== -1) {
            // @ New object already exists
            acc.sankey[newObjIdx].amount += amount;

            return acc;
          }

          acc.sankey.push(newObj);

          return acc;
        },
        { bar: {}, sankey: [] }
      );

      return res.status(200).json(graphs);
    })
    .catch(err => {
      return res.status(400).json({
        response: false,
        message: 'Erro ao pesquisar categorias.',
        err: JSON.stringify(err),
      });
    });
});

export default router;
