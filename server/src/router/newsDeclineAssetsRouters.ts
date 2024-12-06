import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getNewsDeclineAssetsEvents } from '../controller/newsDeclineAssetsController';

const router = express.Router();

router.get('/', asyncErrorHandler(getNewsDeclineAssetsEvents));

export default router;
