import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

export function App() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground">⚡</div>
        <h1 className="text-3xl font-bold tracking-tight">AI Fitness Planner</h1>
        <p className="mt-3 text-muted-foreground">La vista previa está restaurada. Puedes volver a cargar el proyecto para continuar con tus entrenamientos.</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
