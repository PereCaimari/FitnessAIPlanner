import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Section = 'summary' | 'history' | 'planner' | 'exercises'
type Workout = { id: number; title: string; type: string; date: string; duration: string }
type Exercise = { id: string; name: string; group: string; sets: number; reps: number; weight: number }

const initialWorkouts: Workout[] = [
  { id: 1, title: 'Fuerza — Tren superior', type: 'Gimnasio', date: 'Hoy, 08:30', duration: '52 min' },
  { id: 2, title: 'Carrera suave', type: 'Running', date: 'Ayer, 18:10', duration: '34 min' },
  { id: 3, title: 'Movilidad y core', type: 'Personalizado', date: '12 ago, 07:45', duration: '25 min' },
]

const exerciseCatalog: Exercise[] = [
  { id: 'bench', name: 'Press banca', group: 'Pecho', sets: 3, reps: 10, weight: 40 },
  { id: 'incline-bench', name: 'Press inclinado con mancuernas', group: 'Pecho', sets: 3, reps: 10, weight: 18 },
  { id: 'squat', name: 'Sentadilla con barra', group: 'Piernas', sets: 4, reps: 8, weight: 60 },
  { id: 'leg-press', name: 'Prensa de piernas', group: 'Piernas', sets: 3, reps: 12, weight: 100 },
  { id: 'deadlift', name: 'Peso muerto', group: 'Espalda', sets: 3, reps: 6, weight: 70 },
  { id: 'row', name: 'Remo con barra', group: 'Espalda', sets: 3, reps: 10, weight: 35 },
  { id: 'lat-pulldown', name: 'Jalón al pecho', group: 'Espalda', sets: 3, reps: 12, weight: 45 },
  { id: 'shoulder-press', name: 'Press militar', group: 'Hombros', sets: 3, reps: 10, weight: 25 },
  { id: 'lateral-raises', name: 'Elevaciones laterales', group: 'Hombros', sets: 3, reps: 15, weight: 8 },
  { id: 'biceps-curl', name: 'Curl de bíceps', group: 'Brazos', sets: 3, reps: 12, weight: 12 },
  { id: 'triceps-pushdown', name: 'Extensión de tríceps', group: 'Brazos', sets: 3, reps: 12, weight: 20 },
  { id: 'plank', name: 'Plancha', group: 'Core', sets: 3, reps: 45, weight: 0 },
]

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'summary', label: 'Resumen', icon: '⌂' },
  { id: 'history', label: 'Historial', icon: '◷' },
  { id: 'planner', label: 'Planificador IA', icon: '✦' },
  { id: 'exercises', label: 'Ejercicios y grupos', icon: '▦' },
]

function App() {
  const [section, setSection] = useState<Section>('summary')
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Gimnasio')
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [exerciseGroup, setExerciseGroup] = useState('Todos')
  const [catalog, setCatalog] = useState(exerciseCatalog)
  const [muscleGroups, setMuscleGroups] = useState(() => Array.from(new Set(exerciseCatalog.map(exercise => exercise.group))))

  const addWorkout = () => {
    if (!newTitle.trim()) return
    const details = newType === 'Gimnasio' && selectedExercises.length > 0 ? ` · ${selectedExercises.length} ejercicios` : ''
    setWorkouts([{ id: Date.now(), title: `${newTitle}${details}`, type: newType, date: 'Ahora', duration: '—' }, ...workouts])
    setNewTitle('')
    setShowForm(false)
    setSelectedExercises([])
    setExerciseSearch('')
    setExerciseGroup('Todos')
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
      <header className="topbar"><div><p className="eyebrow">{section === 'summary' ? 'BUENOS DÍAS, PERE' : section === 'history' ? 'TU ACTIVIDAD' : section === 'planner' ? 'ASISTENTE PERSONAL' : 'BIBLIOTECA'}</p><h1>{section === 'summary' ? 'Tu resumen' : section === 'history' ? 'Historial de entrenamientos' : section === 'planner' ? 'Planificador IA' : 'Ejercicios y grupos'}</h1></div>{section === 'summary' && <button className="primary-button" onClick={() => setShowForm(true)}>＋ Registrar entrenamiento</button>}</header>
      {section === 'summary' && <Summary workouts={workouts} onHistory={() => setSection('history')} />}
      {section === 'history' && <History workouts={workouts} onAdd={() => setShowForm(true)} />}
      {section === 'planner' && <Planner goal={goal} setGoal={setGoal} plan={plan} onGenerate={generatePlan} />}
      {section === 'exercises' && <ExerciseLibrary catalog={catalog} groups={muscleGroups} onAddGroup={group => setMuscleGroups([...muscleGroups, group])} onAddExercise={exercise => setCatalog([...catalog, { ...exercise, id: `custom-${Date.now()}` }])} />}
    </main>
    {showForm && <WorkoutModal catalog={catalog} groups={muscleGroups} newTitle={newTitle} setNewTitle={setNewTitle} newType={newType} setNewType={setNewType} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} search={exerciseSearch} setSearch={setExerciseSearch} group={exerciseGroup} setGroup={setExerciseGroup} onSave={addWorkout} onClose={() => setShowForm(false)} />}
  </div>
}

function Summary({ workouts, onHistory }: { workouts: Workout[]; onHistory: () => void }) { return <><div className="stats-grid"><Stat label="Entrenamientos" value="3" detail="+12% esta semana" /><Stat label="Tiempo activo" value="2h 14m" detail="vs. 1h 48m anterior" /><Stat label="Racha actual" value="7 días" detail="Tu mejor marca" /></div><section className="content-section"><div className="section-heading"><div><p className="eyebrow">RECIENTE</p><h2>Últimos entrenamientos</h2></div><button className="text-button" onClick={onHistory}>Ver todo →</button></div><WorkoutList workouts={workouts.slice(0, 3)} /></section></> }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }
function History({ workouts, onAdd }: { workouts: Workout[]; onAdd: () => void }) { return <section className="content-section history-page"><div className="section-heading"><div><p className="eyebrow">{workouts.length} ACTIVIDADES</p><h2>Tu recorrido</h2></div><button className="secondary-button" onClick={onAdd}>＋ Añadir sesión</button></div><WorkoutList workouts={workouts} /></section> }
function WorkoutList({ workouts }: { workouts: Workout[] }) { return <div className="workout-list">{workouts.map(workout => <div className="workout-row" key={workout.id}><div className="workout-icon">{workout.type === 'Running' ? '⌁' : workout.type === 'Gimnasio' ? '↗' : '○'}</div><div className="workout-info"><strong>{workout.title}</strong><span>{workout.type} · {workout.date}</span></div><b>{workout.duration}</b><span className="row-arrow">→</span></div>)}</div> }
function Planner({ goal, setGoal, plan, onGenerate }: { goal: string; setGoal: (v: string) => void; plan: string; onGenerate: () => void }) { return <section className="planner-card"><div className="planner-intro"><div className="ai-badge">✦</div><p className="eyebrow">ENTRENADOR INTELIGENTE</p><h2>¿Qué quieres<br /><em>conseguir?</em></h2><p>Cuéntame tu objetivo y crearé una guía que se adapte a ti.</p></div><div className="planner-form"><label>Mi objetivo es...<textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ej. Prepararme para una carrera de 10 km en 8 semanas" /></label><button className="primary-button full" onClick={onGenerate}>Generar mi plan <span>✦</span></button>{plan && <div className="plan-result"><strong>Tu plan empieza aquí</strong><p>{plan}</p></div>}</div></section> }
function WorkoutModal({ catalog, groups, newTitle, setNewTitle, newType, setNewType, selectedExercises, setSelectedExercises, search, setSearch, group, setGroup, onSave, onClose }: { catalog: Exercise[]; groups: string[]; newTitle: string; setNewTitle: (v: string) => void; newType: string; setNewType: (v: string) => void; selectedExercises: Exercise[]; setSelectedExercises: (v: Exercise[]) => void; search: string; setSearch: (v: string) => void; group: string; setGroup: (v: string) => void; onSave: () => void; onClose: () => void }) {
  const available = catalog.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase()) && (group === 'Todos' || exercise.group === group) && !selectedExercises.some(selected => selected.id === exercise.id))
  const toggleExercise = (exercise: Exercise) => setSelectedExercises([...selectedExercises, { ...exercise }])
  const updateExercise = (id: string, key: 'sets' | 'reps' | 'weight', value: number) => setSelectedExercises(selectedExercises.map(exercise => exercise.id === id ? { ...exercise, [key]: Math.max(0, value) } : exercise))
  return <div className="modal-backdrop" onClick={onClose}><div className="modal workout-modal" onClick={event => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">NUEVA ACTIVIDAD</p><h2>Registrar entrenamiento</h2></div><button className="close" onClick={onClose}>×</button></div><label>Nombre del entrenamiento<input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="Ej. Fuerza — Tren inferior" autoFocus /></label><label>Tipo<select value={newType} onChange={event => setNewType(event.target.value)}><option>Gimnasio</option><option>Running</option><option>Ciclismo</option><option>Personalizado</option></select></label>{newType === 'Gimnasio' && <div className="exercise-picker"><div className="picker-heading"><strong>Ejercicios</strong><span>{selectedExercises.length} seleccionados</span></div><div className="exercise-filters"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar ejercicio..." /><select value={group} onChange={event => setGroup(event.target.value)}><option>Todos</option>{groups.map(item => <option key={item}>{item}</option>)}</select></div><div className="exercise-results">{available.length ? available.map(exercise => <button className="exercise-option" key={exercise.id} onClick={() => toggleExercise(exercise)}><span><strong>{exercise.name}</strong><small>{exercise.group}</small></span><b>＋</b></button>) : <p className="empty-search">No hay ejercicios con esos filtros.</p>}</div>{selectedExercises.length > 0 && <div className="selected-exercises"><p className="eyebrow">SERIES Y CARGAS</p>{selectedExercises.map(exercise => <div className="selected-exercise" key={exercise.id}><div><strong>{exercise.name}</strong><small>{exercise.group}</small></div><label>Series<input type="number" min="1" value={exercise.sets} onChange={event => updateExercise(exercise.id, 'sets', Number(event.target.value))} /></label><label>Reps<input type="number" min="1" value={exercise.reps} onChange={event => updateExercise(exercise.id, 'reps', Number(event.target.value))} /></label><label>Kg<input type="number" min="0" step="0.5" value={exercise.weight} onChange={event => updateExercise(exercise.id, 'weight', Number(event.target.value))} /></label></div>)}</div>}</div>}<button className="primary-button full" onClick={onSave}>Guardar entrenamiento</button></div></div>
 }

function ExerciseLibrary({ catalog, groups, onAddGroup, onAddExercise }: { catalog: Exercise[]; groups: string[]; onAddGroup: (group: string) => void; onAddExercise: (exercise: Omit<Exercise, 'id'>) => void }) {
  const [tab, setTab] = useState<'exercises' | 'groups'>('exercises')
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('Todos')
  const [name, setName] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [exerciseGroup, setExerciseGroup] = useState(groups[0] ?? 'Pecho')
  const filtered = catalog.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase()) && (group === 'Todos' || exercise.group === group))
  const createGroup = () => { const value = newGroup.trim(); if (value && !groups.includes(value)) { onAddGroup(value); setExerciseGroup(value); setNewGroup('') } }
  const createExercise = () => { if (name.trim()) { onAddExercise({ name: name.trim(), group: exerciseGroup, sets: 3, reps: 10, weight: 0 }); setName('') } }
  return <section className="content-section library-page"><div className="section-heading"><div><p className="eyebrow">BIBLIOTECA PERSONAL</p><h2>Ejercicios y grupos musculares</h2></div></div><div className="library-tabs"><button className={tab === 'exercises' ? 'library-tab active' : 'library-tab'} onClick={() => setTab('exercises')}>Ejercicios <span>{catalog.length}</span></button><button className={tab === 'groups' ? 'library-tab active' : 'library-tab'} onClick={() => setTab('groups')}>Grupos musculares <span>{groups.length}</span></button></div>{tab === 'exercises' ? <><div className="library-toolbar"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar ejercicio..." /><select value={group} onChange={event => setGroup(event.target.value)}><option>Todos</option>{groups.map(item => <option key={item}>{item}</option>)}</select></div><div className="library-grid">{filtered.map(exercise => <div className="library-card" key={exercise.id}><div className="workout-icon">↗</div><div><strong>{exercise.name}</strong><span>{exercise.group}</span></div></div>)}</div><div className="create-panel"><p className="eyebrow">AÑADIR EJERCICIO</p><div className="create-row"><input value={name} onChange={event => setName(event.target.value)} placeholder="Nombre del ejercicio" /><select value={exerciseGroup} onChange={event => setExerciseGroup(event.target.value)}>{groups.map(item => <option key={item}>{item}</option>)}</select><button className="primary-button" onClick={createExercise}>Crear ejercicio</button></div></div></> : <><div className="group-grid">{groups.map(item => <div className="group-card" key={item}><strong>{item}</strong><span>{catalog.filter(exercise => exercise.group === item).length} ejercicios</span></div>)}</div><div className="create-panel"><p className="eyebrow">CREAR GRUPO MUSCULAR</p><div className="create-row"><input value={newGroup} onChange={event => setNewGroup(event.target.value)} placeholder="Ej. Glúteos" /><button className="primary-button" onClick={createGroup}>Crear grupo</button></div></div></>}</section>
}

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el contenedor de la aplicación')
const rootKey = '__aiFitnessPlannerRoot'
const existingRoot = (window as Window & { [key: string]: unknown })[rootKey] as ReturnType<typeof createRoot> | undefined
const appRoot = existingRoot ?? createRoot(root)
;(window as Window & { [key: string]: unknown })[rootKey] = appRoot
appRoot.render(<App />)
