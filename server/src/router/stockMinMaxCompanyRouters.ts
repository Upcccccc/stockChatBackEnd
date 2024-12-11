import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getMonotonicTrends } from '../controller/stockMinMaxCompanyController';

const router = express.Router();

router.get('/', asyncErrorHandler(getMonotonicTrends));

export default router;
