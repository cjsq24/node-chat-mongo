import { Router } from 'express'
import controller from './countries.controller'

const router = Router()

router.get('/list', controller.list)
router.post('/create', controller.create)
router.put('/update/:id', controller.update)
router.delete('/delete/:id', controller.delete)
router.put('/change-status/:id', controller.changeStatus)

export default router