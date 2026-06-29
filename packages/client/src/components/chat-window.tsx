import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowUp, Bot, Sparkles, LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'
import type { ChatMessage } from '../types/chat'

interface ChatWindowProps {
   messages: ChatMessage[]
   input: string
   isLoading: boolean
   onInputChange: (value: string) => void
   onSend: () => void
}

export function ChatWindow({
   messages,
   input,
   isLoading,
   onInputChange,
   onSend,
}: ChatWindowProps) {
   const endRef = useRef<HTMLDivElement | null>(null)

   useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
   }, [messages, isLoading])

   const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
         event.preventDefault()
         if (!isLoading && input.trim()) {
            onSend()
         }
      }
   }

   return (
      <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#020617_100%)] text-slate-50">
         <header className="border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-violet-500">
                  <Bot className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-lg font-semibold">AI Assistant</p>
                  <p className="text-sm text-slate-400">
                     Powered by your existing Gemini backend
                  </p>
               </div>
            </div>
         </header>

         <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex h-full max-w-5xl flex-col rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur">
               <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                  {messages.length === 0 ? (
                     <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/20 to-violet-500/20">
                           <Sparkles className="h-7 w-7 text-cyan-300" />
                        </div>
                        <h2 className="mb-2 text-xl font-semibold">
                           Start a conversation
                        </h2>
                        <p className="max-w-md text-sm text-slate-400">
                           Ask anything and your existing backend will respond
                           in real time.
                        </p>
                     </div>
                  ) : (
                     messages.map((message) => (
                        <div
                           key={message.id}
                           className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                           <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${
                                 message.role === 'user'
                                    ? 'bg-linear-to-br from-cyan-500 to-violet-500 text-white'
                                    : 'border border-white/10 bg-slate-800/90 text-slate-100'
                              }`}
                           >
                              {message.content}
                           </div>
                        </div>
                     ))
                  )}

                  {isLoading && (
                     <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-800/90 px-4 py-3 text-sm text-slate-300 shadow-lg">
                           <LoaderCircle className="h-4 w-4 animate-spin" />
                           Thinking...
                        </div>
                     </div>
                  )}
                  <div ref={endRef} />
               </div>

               <div className="border-t border-white/10 bg-slate-950/70 p-4 sm:p-5">
                  <div className="mx-auto flex max-w-5xl items-end gap-3">
                     <textarea
                        value={input}
                        onChange={(event) => onInputChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder="Message AI Assistant..."
                        className="min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
                     />
                     <Button
                        onClick={onSend}
                        disabled={isLoading || !input.trim()}
                        className="h-12 w-12 rounded-2xl bg-linear-to-br from-cyan-500 to-violet-500 p-0 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        <ArrowUp className="h-4 w-4" />
                     </Button>
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-500">
                     Press Enter to send · Shift+Enter for a new line
                  </p>
               </div>
            </div>
         </main>
      </div>
   )
}
