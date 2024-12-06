import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getNewsDeclineEvents } from '../controller/newsDeclineController';

const router = express.Router();

router.get('/', asyncErrorHandler(getNewsDeclineEvents));

export default router;
