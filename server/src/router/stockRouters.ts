import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getStockData } from '../controller/stockController';

const router = express.Router();

router.get('/', asyncErrorHandler(getStockData));

export default router;
