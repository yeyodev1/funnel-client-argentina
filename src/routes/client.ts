import express from 'express'
import { confirmAppointment, sendMessages } from '../controllers/sheets.controller'

const router = express.Router()

router.post('/send-messages', sendMessages)
router.post('/confirm-appointment', confirmAppointment)

export default router