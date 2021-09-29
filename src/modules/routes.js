import express from 'express'

import users from './users/users.route'
import chats from './chats/chats.route'

const router = express()

router.use('/users', users)
router.use('/chats', chats)

export default router