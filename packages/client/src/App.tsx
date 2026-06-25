import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'

function App() {
   const [message, setMessage] = useState('')

   useEffect(() => {
      fetch('/api/hello')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
   }, [])

   return (
      <div className="p-4">
         <p className="text-2xl font-bold">{message}</p>
         <Button>click me!</Button>
      </div>
   )
}

export default App
