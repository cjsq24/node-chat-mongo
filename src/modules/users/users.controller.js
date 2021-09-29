import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { exec } from '../../utils/controllerUtils'

export default {
   login: async (req, res) => {
      exec(res, async () => {
         const user = await User.findOne({ email: req.body.email })

         if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({
               _id: user._id,
               email: user.email,
            }, process.env.SECRET_TOKEN);
            delete user._doc.password

            if (req.body?.device_token) {
               User.findByIdAndUpdate(user._id, { device_token: req.body.device_token }).exec()
            }

            res.json({ success: true, values: { ...user._doc, token }, message: 'login_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'login_failed' })
         }
      })
   },

   list: async (req, res) => {
      exec(res, async () => {
         const values = await User.find(req.query)
         res.json({ success: true, values, message: '' })
      })
   },

   get: async (req, res) => {
      exec(res, async () => {
         const values = await User.findById(req.params.id)
         if (values) {
            res.json({ success: true, values, message: 'get_user_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'get_user_error' })
         }
      })
   },

   filter: async (req, res) => {
      exec(res, async () => {
         const values = await User.aggregate([
            {
               $addFields: {
                  nameFilter: {
                     $concat: ['$name', ' ', '$last_name'],
                  }
               }
            },
            {
               $match: {
                  nameFilter: {
                     $regex: `.*${req.query.search}.*`,
                     $options: 'i'
                  },
                  _id: {
                     $ne: mongoose.Types.ObjectId(req.userId)
                  }
               }
            }
         ]).exec();

         res.json({ success: true, values, message: '' })
      })
   },

   create: async (req, res) => {
      exec(res, async () => {
         const values = await User.create(req.body)
         if (values) {
            res.json({ success: true, values, message: 'create_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'create_failed' })
         }
      })
   },

   register: async (req, res) => {
      exec(res, async () => {
         const exists = await User.findOne({ email: req.body.email })
         if (!exists) {
            const password = await bcrypt.hash(req.body.password, 10)
            const values = await User.create({
               name: req.body.name,
               last_name: req.body.last_name,
               email: req.body.email,
               password: password
            })
            delete values._doc.password

            if (values) {
               res.json({ success: true, values, message: 'register_success' })
            } else {
               res.status(400).json({ success: false, values: {}, message: 'create_failed' })
            }
         } else {
            res.status(400).json({ success: false, values: {}, message: 'user_exists' })
         }
      })
   },

   update: async (req, res) => {
      exec(res, async () => {
         const values = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            code: req.body.code
         }, { new: true })

         if (values) {
            res.json({ success: true, values, message: 'update_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'update_failed' })
         }
      })
   },

   delete: async (req, res) => {
      exec(res, async () => {
         const values = await User.findByIdAndRemove(req.params.id)
         if (values) {
            res.json({ success: true, values: {}, message: 'delete_success' })
         } else {
            res.status(400).json({ success: false, values: {}, message: 'delete_failed' })
         }
      })
   },

   changeStatus: async (req, res) => {
      exec(res, async () => {
         if (req.body?.status) {
            const values = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })

            if (values)
               res.json({ success: true, values: {}, message: 'change_status_success' })
            else
               res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
         } else
            res.status(400).json({ success: false, values: {}, message: 'change_status_failed' })
      })
   }
}