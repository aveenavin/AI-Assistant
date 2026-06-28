import type { Request, Response } from 'express'
import zod from 'zod'
import type { ChatService } from '../services/chat.service'

const requestSchema = zod.object({
   prompt: zod
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt must be less than 1000 characters'),
   conversationId: zod.uuid(),
})

export class ChatController {
   constructor(private readonly chatService: ChatService) {}

   async handleChat(req: Request, res: Response): Promise<void> {
      const parseResult = requestSchema.safeParse(req.body)
      if (!parseResult.success) {
         res.status(400).json(parseResult.error.format())
         return
      }

      try {
         const { prompt, conversationId } = req.body
         const response = await this.chatService.generateResponse(
            prompt,
            conversationId
         )
         res.json(response)
      } catch (error) {
         res.status(500).json({
            error: 'Cool ! Failed to generate a response due to server issue !',
         })
      }
   }
}
