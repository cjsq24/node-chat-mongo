import { Router } from 'express'
import controller from './users.controller'
import { auth } from '../../middlewares/auth'

const router = Router()

router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/filter', auth, controller.filter)
router.get('/list', controller.list)
router.get('/get/:id', controller.get)
router.post('/create', controller.create)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)
router.put('/change-status/:id', controller.changeStatus)

export default router