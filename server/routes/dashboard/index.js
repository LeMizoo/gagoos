import express from 'express';
import statsRouter from './stats.js';

const router = express.Router();

router.use('/stats', statsRouter);

export default router;