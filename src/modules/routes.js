import express from 'express'

import users from './users/users.route'
import chats from './chats/chats.route'
import pushNotification from './pushNotification/pushNotification.route'

const router = express()

router.use('/users', users)
router.use('/chats', chats)
router.use('/push-notifications', pushNotification)

export default router