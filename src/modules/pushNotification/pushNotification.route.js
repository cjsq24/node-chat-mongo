import express from "express"

//import token from '../middlewares/token'
import controller from './pushNotification.controller'

const router = express()

router.get('/send-to-device', controller.sendToDevice)
router.get('/send-topic', controller.sendTopic)
router.get('/send-multicast', controller.sendMulticast)

export default router;