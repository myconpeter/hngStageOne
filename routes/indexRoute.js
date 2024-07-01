import express from 'express';
import helloController from '../controllers/indexPage.js';

const router = express.Router();

router.get('/hello', helloController);

export default router;
