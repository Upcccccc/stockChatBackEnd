import express from 'express';
import queryRoutes from './queryRouters';
import stockRoutes from './stockRouters';
import newsRoutes from './newsRouters';
import newsDeclineRoutes from './newsDeclineRouters';
import stockIndustryRoutes from './stockIndustryRouters';
import stockMinMaxCompanyRoutes from './stockMinMaxCompanyRouters';
import stockSimilarCompaniesRoutes from './stockSimilarCompaniesRouters';

const router = express.Router();

router.use('/query', queryRoutes);
router.use('/stock-data', stockRoutes);
router.use('/news-events', newsRoutes);
router.use('/news-decline-company', newsDeclineRoutes);
router.use('/stocks-industry', stockIndustryRoutes);
router.use('/stocks-min-max-company', stockMinMaxCompanyRoutes);
router.use('/stocks-similar-companies', stockSimilarCompaniesRoutes);

export default router;
