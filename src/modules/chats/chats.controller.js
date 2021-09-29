import { Chat, User } from '../models'
import { exec } from '../../utils/controllerUtils'
import { socketServer } from '../../socket'

export default {
   list: async (req, res) => {
      exec(res, async () => {
         const values = await Chat.find(req.query)
         res.json({success: true, values, message: ''})
      })
   },

   listChats: async (req, res) => {
      exec(res, async () => {
         const values = await Chat.find({ 'users_id._id': req.userId }).sort({updatedAt: -1}).exec()

         values.map(chat => {
            const message = chat._doc.messages[chat._doc.messages.length - 1]//.at(-1)
            chat._doc.messages = message
            return chat
         })

         res.json({success: true, values, message: ''})
      })
   },

   getChat: async (req, res) => {
      exec(res, async () => {
         const values = await Chat.findOne({
            $and: [
               {'users_id._id': req.userId},
               {'users_id._id': req.params.user_to_id}
            ]
         }).exec()
         if (values) {
            res.json({success: true, values, message: 'get_chat_success'})
         } else {
            res.json({success: false, values: {}, message: 'get_chat_not_found'})
         }
      })
   },

   sendMessage: async (req, res) => {
      exec(res, async () => {
         const { body } = req
         const userFrom = { _id: req.userId }
         const userTo = { _id: req.params.user_to_id }

         if (userTo._id) {
            //Consulto si estos usuarios ya existen en el documento
            const chat = await Chat.findOne({
               $and: [
                  {'users_id._id': userFrom._id},
                  {'users_id._id': userTo._id}
               ]
               /*'$and': [{
                  'users_id._id': userFrom._id,
                  'users_id._id': userTo._id
               }]*/
            }).exec()
            
            
            const message = {
               sent_by_id: userFrom._id,
               content: body.content
            }
            
            //Si no existen, los agrego
            let newChat = {}
            if (!chat) {
               const userFromFind = await User.findById(userFrom._id).exec()
               userFrom.name = `${userFromFind.name} ${userFromFind.last_name}`
   
               const userToFind = await User.findById(userTo._id).exec()
               userTo.name = `${userToFind.name} ${userToFind.last_name}`

               newChat = await Chat.create({
                  users_id: [userFrom, userTo],
                  messages: [message]
               })
            } else {
               const messages = chat.messages
               messages.push(message)
               newChat = await Chat.findByIdAndUpdate(chat._id, { messages }, { new: true })
            }

            if (newChat) {
               console.log('hacemos el emit a:', userTo.name)
               socketServer.emit('receive-message', {
                  ...newChat._doc,
                  messages: newChat._doc.messages[newChat._doc.messages.length - 1],
                  userToId: userTo._id,
                  userFromId: userFrom._id
               })
               console.log('finaliza el emit')
            }
            
            res.json({success: true, values: newChat?._doc, message: 'send_message_success'})
         } else {
            res.status(400).json({success: false, values: {}, message: 'send_message_error'})
         }
      })
   }
}