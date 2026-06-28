import express from 'express'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ConversationRepository } from './repositories/conversation.repository'
import { ChatService } from './services/chat.service'
import { ChatController } from './controllers/chat.controller'
import { createRoutes } from './routes'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const model = genAI.getGenerativeModel({
   model: 'gemini-2.5-flash-lite',
   generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 100,
   },
})

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const conversationRepository = new ConversationRepository()
const chatService = new ChatService(conversationRepository, model)
const chatController = new ChatController(chatService)

app.use(createRoutes(chatController))

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`)
})
