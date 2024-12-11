import express from 'express';
import queryRoutes from './queryRouters';
import stockRoutes from './stockRouters';
import newsRoutes from './newsRouters';
import newsDeclineRoutes from './newsDeclineRouters';
import newsDeclineAssetsRoutes from './newsDeclineAssetsRouters';
import stockMinMaxCompanyRoutes from './stockMinMaxCompanyRouters';
import stockMinMaxPriceRoutes from './stockMinMaxPriceRouters';

const router = express.Router();

router.use('/query', queryRoutes);
router.use('/stock-data', stockRoutes);
router.use('/news-events', newsRoutes);
router.use('/news-decline-company', newsDeclineRoutes);
router.use('/news-decline-assets', newsDeclineAssetsRoutes);
router.use('/stocks-min-max-company', stockMinMaxCompanyRoutes);
router.use('/stocks-min-max-price', stockMinMaxPriceRoutes);

export default router;
