import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getSimilarCompanies } from '../controller/stockSimilarCompaniesController';

const router = express.Router();

router.get('/', asyncErrorHandler(getSimilarCompanies));

export default router;
