import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Section = 'summary' | 'history' | 'planner'
type Workout = { id: number; title: string; type: string; date: string; duration: string }

const initialWorkouts: Workout[] = [
  { id: 1, title: 'Fuerza — Tren superior', type: 'Gimnasio', date: 'Hoy, 08:30', duration: '52 min' },
  { id: 2, title: 'Carrera suave', type: 'Running', date: 'Ayer, 18:10', duration: '34 min' },
  { id: 3, title: 'Movilidad y core', type: 'Personalizado', date: '12 ago, 07:45', duration: '25 min' },
]

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'summary', label: 'Resumen', icon: '⌂' },
  { id: 'history', label: 'Historial', icon: '◷' },
  { id: 'planner', label: 'Planificador IA', icon: '✦' },
]

function App() {
  const [section, setSection] = useState<Section>('summary')
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Gimnasio')
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState('')

  const addWorkout = () => {
    if (!newTitle.trim()) return
    setWorkouts([{ id: Date.now(), title: newTitle, type: newType, date: 'Ahora', duration: '—' }, ...workouts])
    setNewTitle('')
    setShowForm(false)
    setSection('history')
  }

  const generatePlan = () => {
    if (!goal.trim()) return
    setPlan(`Tu plan personalizado para ${goal}: 3 sesiones semanales, empezando con 10 minutos de calentamiento, trabajo principal progresivo y 5 minutos de vuelta a la calma. Descansa al menos un día entre sesiones y aumenta la carga gradualmente.`)
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">AI</div><div><strong>Fitness Planner</strong><small>Tu progreso, más inteligente</small></div></div>
      <nav aria-label="Navegación principal">{navItems.map(item => <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-bottom"><button className="help-button">? <span>Ayuda y consejos</span></button><div className="profile"><div className="avatar">PC</div><div><strong>Pere</strong><small>Mi perfil</small></div><span>•••</span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div><p className="eyebrow">{section === 'summary' ? 'BUENOS DÍAS, PERE' : section === 'history' ? 'TU ACTIVIDAD' : 'ASISTENTE PERSONAL'}</p><h1>{section === 'summary' ? 'Tu resumen' : section === 'history' ? 'Historial de entrenamientos' : 'Planificador IA'}</h1></div><button className="primary-button" onClick={() => setShowForm(true)}>＋ Registrar entrenamiento</button></header>
      {section === 'summary' && <Summary workouts={workouts} onHistory={() => setSection('history')} />}
      {section === 'history' && <History workouts={workouts} onAdd={() => setShowForm(true)} />}
      {section === 'planner' && <Planner goal={goal} setGoal={setGoal} plan={plan} onGenerate={generatePlan} />}
    </main>
    {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">NUEVA ACTIVIDAD</p><h2>Registrar entrenamiento</h2></div><button className="close" onClick={() => setShowForm(false)}>×</button></div><label>Nombre del entrenamiento<input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ej. Fuerza — Tren inferior" autoFocus /></label><label>Tipo<select value={newType} onChange={e => setNewType(e.target.value)}><option>Gimnasio</option><option>Running</option><option>Ciclismo</option><option>Personalizado</option></select></label><button className="primary-button full" onClick={addWorkout}>Guardar entrenamiento</button></div></div>}
  </div>
}

function Summary({ workouts, onHistory }: { workouts: Workout[]; onHistory: () => void }) { return <><section className="hero-card"><div><p className="eyebrow light">ESTA SEMANA</p><h2>La constancia<br /><em>se construye.</em></h2><p>Ya llevas {workouts.length + 1} entrenamientos registrados. Sigue así.</p><button className="light-button" onClick={onHistory}>Ver actividad <span>→</span></button></div><div className="hero-orbit"><div className="orbit-number">03<small>sesiones</small></div></div></section><div className="stats-grid"><Stat label="Entrenamientos" value="3" detail="+12% esta semana" /><Stat label="Tiempo activo" value="2h 14m" detail="vs. 1h 48m anterior" /><Stat label="Racha actual" value="7 días" detail="Tu mejor marca" /></div><section className="content-section"><div className="section-heading"><div><p className="eyebrow">RECIENTE</p><h2>Últimos entrenamientos</h2></div><button className="text-button" onClick={onHistory}>Ver todo →</button></div><WorkoutList workouts={workouts.slice(0, 3)} /></section></> }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }
function History({ workouts, onAdd }: { workouts: Workout[]; onAdd: () => void }) { return <section className="content-section history-page"><div className="section-heading"><div><p className="eyebrow">{workouts.length} ACTIVIDADES</p><h2>Tu recorrido</h2></div><button className="secondary-button" onClick={onAdd}>＋ Añadir sesión</button></div><WorkoutList workouts={workouts} /></section> }
function WorkoutList({ workouts }: { workouts: Workout[] }) { return <div className="workout-list">{workouts.map(workout => <div className="workout-row" key={workout.id}><div className="workout-icon">{workout.type === 'Running' ? '⌁' : workout.type === 'Gimnasio' ? '↗' : '○'}</div><div className="workout-info"><strong>{workout.title}</strong><span>{workout.type} · {workout.date}</span></div><b>{workout.duration}</b><span className="row-arrow">→</span></div>)}</div> }
function Planner({ goal, setGoal, plan, onGenerate }: { goal: string; setGoal: (v: string) => void; plan: string; onGenerate: () => void }) { return <section className="planner-card"><div className="planner-intro"><div className="ai-badge">✦</div><p className="eyebrow">ENTRENADOR INTELIGENTE</p><h2>¿Qué quieres<br /><em>conseguir?</em></h2><p>Cuéntame tu objetivo y crearé una guía que se adapte a ti.</p></div><div className="planner-form"><label>Mi objetivo es...<textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ej. Prepararme para una carrera de 10 km en 8 semanas" /></label><button className="primary-button full" onClick={onGenerate}>Generar mi plan <span>✦</span></button>{plan && <div className="plan-result"><strong>Tu plan empieza aquí</strong><p>{plan}</p></div>}</div></section> }

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el contenedor de la aplicación')
createRoot(root).render(<App />)
