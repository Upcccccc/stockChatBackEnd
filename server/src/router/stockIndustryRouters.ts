import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getIndustryAnalysis } from '../controller/stockIndustryController';

const router = express.Router();

router.get('/', asyncErrorHandler(getIndustryAnalysis));

export default router;
