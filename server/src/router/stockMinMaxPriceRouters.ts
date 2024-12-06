import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getMinMaxPriceEvents } from '../controller/stockMinMaxPriceController';

const router = express.Router();

router.get('/', asyncErrorHandler(getMinMaxPriceEvents));

export default router;
