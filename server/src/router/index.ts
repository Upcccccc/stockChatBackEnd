import express from 'express';
import queryRoutes from './queryRouters';
import stockRoutes from './stockRouters';
import newsRoutes from './newsRouters';

const router = express.Router();

router.use('/query', queryRoutes);
router.use('/stock-data', stockRoutes);
router.use('/news-events', newsRoutes);

export default router;
