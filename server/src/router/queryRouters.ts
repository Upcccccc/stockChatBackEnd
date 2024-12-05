import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { handleQuery } from '../controller/queryController';

const router = express.Router();

router.post('/', asyncErrorHandler(handleQuery));

export default router;
