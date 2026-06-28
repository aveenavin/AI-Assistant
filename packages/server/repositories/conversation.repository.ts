import type { GenerativeModel } from '@google/generative-ai'

export type ChatSession = ReturnType<GenerativeModel['startChat']>

export class ConversationRepository {
   private readonly chats = new Map<string, ChatSession>()

   getOrCreateChat(
      conversationId: string,
      createChat: () => ChatSession
   ): ChatSession {
      const existingChat = this.chats.get(conversationId)
      if (existingChat) {
         return existingChat
      }

      const chat = createChat()
      this.chats.set(conversationId, chat)
      return chat
   }
}
