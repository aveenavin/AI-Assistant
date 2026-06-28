import { Router } from 'express'
import type { Request, Response } from 'express'
import type { ChatController } from '../controllers/chat.controller'

export function createRoutes(chatController: ChatController): Router {
   const router = Router()

   router.get('/', (_req: Request, res: Response) => {
      res.json({ message: 'Hello, world!' })
   })

   router.get('/api/hello', (_req: Request, res: Response) => {
      res.json({ message: 'Hello, world!' })
   })

   router.post('/api/chat', chatController.handleChat.bind(chatController))

   return router
}
