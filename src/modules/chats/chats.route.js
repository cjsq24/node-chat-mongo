import { Router } from 'express'
import controller from './chats.controller'
import { auth } from '../../middlewares/auth'

const router = Router()

router.get('/list', auth, controller.listChats)
router.get('/get-chat/:user_to_id', auth, controller.getChat)
router.post('/send-message/:user_to_id', auth, controller.sendMessage)

export default router