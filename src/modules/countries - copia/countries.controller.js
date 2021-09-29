import { Countries } from '../models'
import { exec } from '../../utils/controllerUtils'

export default {
   list: async (req, res) => {
      exec(res, async () => {
         const values = await Countries.find(req.query)
         res.json({success: true, values, message: ''})
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const values = await Countries.create(req.body)
         if (values) {
            res.json({success: true, values, message: 'create_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'create_failed'})
         }
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const values = await Countries.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            code: req.body.code
         }, { new: true })

         if (values) {
            res.json({success: true, values, message: 'update_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'update_failed'})
         }
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await Countries.findByIdAndRemove(req.params.id)
         if (values) {
            res.json({success: true, values: {}, message: 'delete_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'delete_failed'})
         }
      })
   },

   changeStatus: async (req, res) => {
      exec(res, async () => {
         if (req.body?.status) {
            const values = await Countries.findByIdAndUpdate(req.params.id, { status: req.body.status }, {new: true})

            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   }
}