import type { GenerativeModel } from '@google/generative-ai'
import type { ConversationRepository } from '../repositories/conversation.repository'

export class ChatService {
   constructor(
      private readonly conversationRepository: ConversationRepository,
      private readonly model: GenerativeModel
   ) {}

   async generateResponse(
      prompt: string,
      conversationId: string
   ): Promise<{ message: string }> {
      const chat = this.conversationRepository.getOrCreateChat(
         conversationId,
         () => this.model.startChat()
      )
      const result = await chat.sendMessage(prompt)

      return {
         message: result.response.text(),
      }
   }
}
