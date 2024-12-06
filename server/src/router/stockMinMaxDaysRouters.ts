import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getMinMaxDaysEvents } from '../controller/stockMinMaxDaysController';

const router = express.Router();

router.get('/', asyncErrorHandler(getMinMaxDaysEvents));

export default router;
