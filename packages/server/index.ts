import express from 'express'
import type { Request, Response } from 'express'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import zod from 'zod'
import { uuid } from 'zod'
// ___________________________________________________________________________
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
// _____________________________________________________________________________

app.get('/', (req: Request, res: Response) => {
   res.json({ message: `Hello, world!` })
})

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: `Hello, world!` })
})
// _____________________________________________________________________________
const chats = new Map<string, ReturnType<typeof model.startChat>>()

const requestSchema = zod.object({
   prompt: zod
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt must be less than 1000 characters'),
   conversationId: zod.uuid(),
})
// _____________________________________________________________________________
app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = requestSchema.safeParse(req.body)
   if (!parseResult.success) {
      res.status(400).json(parseResult.error.format())
      return
   }

   try {
      const { prompt, conversationId } = req.body
      let chat = chats.get(conversationId)
      if (!chat) {
         chat = model.startChat()
         chats.set(conversationId, chat)
      }
      const result = await chat.sendMessage(prompt)
      const message = result.response.text()

      res.json({
         message,
      })
   } catch (error) {
      res.status(500).json({
         error: 'Cool ! Failed to generate a response due to server issue !',
      })
   }
})

// _____________________________________________________________________________
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`)
})
