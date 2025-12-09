import React from 'react'
import { Button } from '@repo/ui/button'
import { ZodExample } from './components/ZodExample'

function App() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold animate-pulse">Vite + React + TailwindCSS + TypeScript + Shadcn</h1>
    <Button variant="outline">Hello World</Button>
    <ZodExample />
    </div>
  )
}
export default App
