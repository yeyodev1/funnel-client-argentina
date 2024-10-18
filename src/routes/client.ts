import express from 'express'
import { sendMessages } from '../controllers/sheets.controller'

const router = express.Router()

router.post('/send-messages', sendMessages)

export default router