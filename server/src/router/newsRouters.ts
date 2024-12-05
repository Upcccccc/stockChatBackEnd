import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getNewsEvents } from '../controller/newsController';

const router = express.Router();

router.get('/', asyncErrorHandler(getNewsEvents));

export default router;
