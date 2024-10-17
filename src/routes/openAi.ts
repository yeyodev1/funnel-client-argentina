import express from 'express'

import {
  generateImage,
} from '../controllers/openAi.controller';

const router = express.Router()

router.post('/generate-image', generateImage);


export default router;
