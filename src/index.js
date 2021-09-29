import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import dbConnection from './dbConnection'
import routes from './modules/routes'
import socket from './socket'

const app = express()

const server = http.createServer(app);
socket(server)

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', routes)

app.get('/', (req, res) => {
   res.send('Este es el backend node-chat-mongo')
})

server.listen(process.env.PORT || 3000, () => {
   console.log('Server on port 4000')
   dbConnection()
})