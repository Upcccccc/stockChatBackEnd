import express from 'express';
import { asyncErrorHandler } from '../utils/apiHandler';
import { getSimilarNews } from '../controller/similarNewsController';

const router = express.Router();

router.post('/', asyncErrorHandler(getSimilarNews));

export default router;
