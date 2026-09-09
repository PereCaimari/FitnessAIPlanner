export type PlannerModality = 'Running' | 'Gimnasio' | 'Natación'

export type PlannerAnswers = {
  goal: string
  modalities: PlannerModality[]
  level: string
  sessionsPerWeek: string
  sessionMinutes: string
  planWeeks: string
  startDate: string
  availability: string
  limitations: string
  runningDistance: string
  runningPace: string
  swimmingDistance: string
  swimmingStrokes: string
  equipment: string
}

export type AiPlanSession = {
  weekNumber: number
  dayLabel: string
  scheduledDate: string
  title: string
  type: PlannerModality
  durationMinutes: number
  intensity: 'Baja' | 'Moderada' | 'Alta'
  status: 'scheduled'
  notes: string
  runningDetails: Record<string, unknown>
  swimmingDetails: Record<string, unknown>
  exercises: Array<{ name: string; sets: number; reps: number; restSeconds: number; notes: string }>
}

export type AiPlanResponse = {
  plan: { title: string; goal: string; summary: string; durationWeeks: number; sessionsPerWeek: number }
  sessions: AiPlanSession[]
}

export const aiPlanSchema = {
  type: 'object',
  properties: {
    plan: { type: 'object', properties: { title: { type: 'string' }, goal: { type: 'string' }, summary: { type: 'string' }, durationWeeks: { type: 'number' }, sessionsPerWeek: { type: 'number' } }, required: ['title', 'goal', 'summary', 'durationWeeks', 'sessionsPerWeek'] },
    sessions: { type: 'array', items: { type: 'object', properties: { weekNumber: { type: 'number' }, dayLabel: { type: 'string' }, scheduledDate: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, durationMinutes: { type: 'number' }, intensity: { type: 'string' }, status: { type: 'string' }, notes: { type: 'string' }, runningDetails: { type: 'object' }, swimmingDetails: { type: 'object' }, exercises: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, sets: { type: 'number' }, reps: { type: 'number' }, restSeconds: { type: 'number' }, notes: { type: 'string' } } } } }, required: ['weekNumber', 'dayLabel', 'scheduledDate', 'title', 'type', 'durationMinutes', 'intensity', 'status', 'notes', 'runningDetails', 'swimmingDetails', 'exercises'] } }
  },
  required: ['plan', 'sessions']
}

export function validateAiPlan(value: unknown, answers: PlannerAnswers): AiPlanResponse {
  const response = value as Partial<AiPlanResponse>
  if (!response.plan || !Array.isArray(response.sessions) || response.sessions.length === 0) throw new Error('La IA no devolvió un plan con sesiones.')
  const durationWeeks = Number(response.plan.durationWeeks)
  if (!Number.isFinite(durationWeeks) || durationWeeks < 1) throw new Error('La duración del plan generado no es válida.')
  const sessions = response.sessions.map(session => {
    if (!answers.modalities.includes(session.type)) throw new Error(`La IA generó una modalidad no seleccionada: ${session.type}.`)
    if (!session.scheduledDate || !session.title || Number(session.durationMinutes) <= 0 || session.weekNumber < 1 || session.weekNumber > durationWeeks) throw new Error('Una sesión generada contiene datos inválidos.')
    return { ...session, status: 'scheduled' as const, durationMinutes: Math.round(Number(session.durationMinutes)) }
  })
  return { plan: { ...response.plan, durationWeeks, sessionsPerWeek: Number(response.plan.sessionsPerWeek) }, sessions }
}
