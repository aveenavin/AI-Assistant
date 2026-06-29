import { useMemo, useState } from 'react'
import { ChatWindow } from './components/chat-window'
import type { ChatMessage } from './types/chat'

function App() {
   const [messages, setMessages] = useState<ChatMessage[]>([])
   const [input, setInput] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState('')

   const conversationId = useMemo(() => {
      const stored = window.sessionStorage.getItem('chat-conversation-id')
      if (stored) {
         return stored
      }

      const nextId = crypto.randomUUID()
      window.sessionStorage.setItem('chat-conversation-id', nextId)
      return nextId
   }, [])

   const handleSend = async () => {
      const trimmedInput = input.trim()
      if (!trimmedInput || isLoading) {
         return
      }

      const userMessage: ChatMessage = {
         id: crypto.randomUUID(),
         role: 'user',
         content: trimmedInput,
      }

      setMessages((currentMessages) => [...currentMessages, userMessage])
      setInput('')
      setError('')
      setIsLoading(true)

      try {
         const response = await fetch(
            'https://ai-assistant-vrf3.onrender.com/api/chat',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  prompt: trimmedInput,
                  conversationId,
               }),
            }
         )

         const data = await response.json()

         if (!response.ok) {
            throw new Error(
               data?.error || 'The assistant could not respond right now.'
            )
         }

         const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.message || 'Sorry, I could not generate a response.',
         }

         setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
         ])
      } catch (err) {
         const message =
            err instanceof Error ? err.message : 'Something went wrong.'
         setError(message)
         setMessages((currentMessages) => [
            ...currentMessages,
            {
               id: crypto.randomUUID(),
               role: 'assistant',
               content: `Sorry, something went wrong. ${message}`,
            },
         ])
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className="min-h-screen">
         {error && (
            <div className="mx-auto max-w-5xl px-4 pt-4 text-sm text-rose-300 sm:px-6 lg:px-8">
               <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
                  {error}
               </div>
            </div>
         )}
         <ChatWindow
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSend={handleSend}
         />
      </div>
   )
}

export default App
