import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

type Section = 'summary' | 'history' | 'planner' | 'exercises'
type Workout = { id: number; title: string; type: string; date: string; duration: string; rpe: number; gpxSplits?: string[] }
type Exercise = { id: string; name: string; group: string; sets: number; reps: number; weight: number }
type RunningBlock = { id: number; repetitions: number; distance: number; pace: string }
type GpxSummary = { elevationGain: number; elevationLoss: number; startTime: string; endTime: string; splits: string[] }

const initialWorkouts: Workout[] = [
  { id: 1, title: 'Fuerza — Tren superior', type: 'Gimnasio', date: 'Hoy, 08:30', duration: '52 min', rpe: 7 },
  { id: 2, title: 'Carrera suave', type: 'Running', date: 'Ayer, 18:10', duration: '34 min', rpe: 5 },
  { id: 3, title: 'Movilidad y core', type: 'Personalizado', date: '12 ago, 07:45', duration: '25 min', rpe: 3 },
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
  const [rpe, setRpe] = useState('5')
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [exerciseGroup, setExerciseGroup] = useState('Todos')
  const [catalog, setCatalog] = useState(exerciseCatalog)
  const [muscleGroups, setMuscleGroups] = useState(() => Array.from(new Set(exerciseCatalog.map(exercise => exercise.group))))
  const [runningMode, setRunningMode] = useState<'Rodaje' | 'Series'>('Rodaje')
  const [runningDistance, setRunningDistance] = useState('')
  const [runningTime, setRunningTime] = useState('')
  const [realPace, setRealPace] = useState('')
  const [gpxFileName, setGpxFileName] = useState('')
  const [gpxSummary, setGpxSummary] = useState<GpxSummary | null>(null)
  const [targetPace, setTargetPace] = useState('')
  const [runningBlocks, setRunningBlocks] = useState<RunningBlock[]>([{ id: Date.now(), repetitions: 4, distance: 400, pace: '4:45' }])

  const addWorkout = () => {
    if (!newTitle.trim()) return
    const details = newType === 'Gimnasio' && selectedExercises.length > 0 ? ` · ${selectedExercises.length} ejercicios` : ''
    setWorkouts([{ id: Date.now(), title: `${newTitle}${details}`, type: newType, date: 'Ahora', duration: newType === 'Running' && runningTime ? `${runningTime} min` : '—', rpe: Number(rpe), gpxSplits: gpxSummary?.splits }, ...workouts])
    setNewTitle('')
    setRpe('5')
    setShowForm(false)
    setSelectedExercises([])
    setExerciseSearch('')
    setExerciseGroup('Todos')
    setRunningMode('Rodaje')
    setRunningDistance('')
    setRunningTime('')
    setRealPace('')
    setGpxFileName('')
    setGpxSummary(null)
    setTargetPace('')
    setRunningBlocks([{ id: Date.now(), repetitions: 4, distance: 400, pace: '4:45' }])
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
    {showForm && <WorkoutModal catalog={catalog} groups={muscleGroups} newTitle={newTitle} setNewTitle={setNewTitle} newType={newType} setNewType={setNewType} rpe={rpe} setRpe={setRpe} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} search={exerciseSearch} setSearch={setExerciseSearch} group={exerciseGroup} setGroup={setExerciseGroup} runningMode={runningMode} setRunningMode={setRunningMode} runningDistance={runningDistance} setRunningDistance={setRunningDistance} runningTime={runningTime} setRunningTime={setRunningTime} realPace={realPace} setRealPace={setRealPace} gpxFileName={gpxFileName} setGpxFileName={setGpxFileName} gpxSummary={gpxSummary} setGpxSummary={setGpxSummary} targetPace={targetPace} setTargetPace={setTargetPace} runningBlocks={runningBlocks} setRunningBlocks={setRunningBlocks} onSave={addWorkout} onClose={() => setShowForm(false)} />}
  </div>
}

function Summary({ workouts, onHistory }: { workouts: Workout[]; onHistory: () => void }) { return <><div className="stats-grid"><Stat label="Entrenamientos" value="3" detail="+12% esta semana" /><Stat label="Tiempo activo" value="2h 14m" detail="vs. 1h 48m anterior" /><Stat label="Racha actual" value="7 días" detail="Tu mejor marca" /></div><section className="content-section"><div className="section-heading"><div><p className="eyebrow">RECIENTE</p><h2>Últimos entrenamientos</h2></div><button className="text-button" onClick={onHistory}>Ver todo →</button></div><WorkoutList workouts={workouts.slice(0, 3)} /></section></> }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }
function History({ workouts, onAdd }: { workouts: Workout[]; onAdd: () => void }) { return <section className="content-section history-page"><div className="section-heading"><div><p className="eyebrow">{workouts.length} ACTIVIDADES</p><h2>Tu recorrido</h2></div><button className="secondary-button" onClick={onAdd}>＋ Añadir sesión</button></div><WorkoutList workouts={workouts} /></section> }
function WorkoutList({ workouts }: { workouts: Workout[] }) { return <div className="workout-list">{workouts.map(workout => <div className="workout-row" key={workout.id}><div className="workout-icon">{workout.type === 'Running' ? '⌁' : workout.type === 'Gimnasio' ? '↗' : '○'}</div><div className="workout-info"><strong>{workout.title}</strong><span>{workout.type} · {workout.date}</span><div className="saved-rpe"><small>RPE</small><strong>{workout.rpe}/10</strong></div>{workout.gpxSplits?.length ? <div className="saved-splits"><small>Ritmo por km</small>{workout.gpxSplits.map(split => <span key={split}>{split}</span>)}</div> : null}</div><b>{workout.duration}</b><span className="row-arrow">→</span></div>)}</div> }
function Planner({ goal, setGoal, plan, onGenerate }: { goal: string; setGoal: (v: string) => void; plan: string; onGenerate: () => void }) { return <section className="planner-card"><div className="planner-intro"><div className="ai-badge">✦</div><p className="eyebrow">ENTRENADOR INTELIGENTE</p><h2>¿Qué quieres<br /><em>conseguir?</em></h2><p>Cuéntame tu objetivo y crearé una guía que se adapte a ti.</p></div><div className="planner-form"><label>Mi objetivo es...<textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ej. Prepararme para una carrera de 10 km en 8 semanas" /></label><button className="primary-button full" onClick={onGenerate}>Generar mi plan <span>✦</span></button>{plan && <div className="plan-result"><strong>Tu plan empieza aquí</strong><p>{plan}</p></div>}</div></section> }
function WorkoutModal({ catalog, groups, newTitle, setNewTitle, newType, setNewType, rpe, setRpe, selectedExercises, setSelectedExercises, search, setSearch, group, setGroup, runningMode, setRunningMode, runningDistance, setRunningDistance, runningTime, setRunningTime, realPace, setRealPace, gpxFileName, setGpxFileName, gpxSummary, setGpxSummary, targetPace, setTargetPace, runningBlocks, setRunningBlocks, onSave, onClose }: { catalog: Exercise[]; groups: string[]; newTitle: string; setNewTitle: (v: string) => void; newType: string; setNewType: (v: string) => void; rpe: string; setRpe: (v: string) => void; selectedExercises: Exercise[]; setSelectedExercises: (v: Exercise[]) => void; search: string; setSearch: (v: string) => void; group: string; setGroup: (v: string) => void; runningMode: 'Rodaje' | 'Series'; setRunningMode: (v: 'Rodaje' | 'Series') => void; runningDistance: string; setRunningDistance: (v: string) => void; runningTime: string; setRunningTime: (v: string) => void; realPace: string; setRealPace: (v: string) => void; gpxFileName: string; setGpxFileName: (v: string) => void; gpxSummary: GpxSummary | null; setGpxSummary: (v: GpxSummary | null) => void; targetPace: string; setTargetPace: (v: string) => void; runningBlocks: RunningBlock[]; setRunningBlocks: (v: RunningBlock[]) => void; onSave: () => void; onClose: () => void }) {
  const parseGpx = async (file: File) => {
    const xml = new DOMParser().parseFromString(await file.text(), 'application/xml')
    if (xml.querySelector('parsererror')) throw new Error('El archivo GPX no tiene un formato válido.')
    const points = Array.from(xml.querySelectorAll('trkpt')).map(point => ({ lat: Number(point.getAttribute('lat')), lon: Number(point.getAttribute('lon')), time: point.querySelector('time')?.textContent ? Date.parse(point.querySelector('time')!.textContent!) : NaN })).filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lon))
    if (points.length < 2) throw new Error('El GPX no contiene suficientes puntos de recorrido.')
    const toRadians = (value: number) => value * Math.PI / 180
    const segmentDistance = (from: typeof points[number], to: typeof points[number]) => {
      const dLat = toRadians(to.lat - from.lat)
      const dLon = toRadians(to.lon - from.lon)
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLon / 2) ** 2
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    const elevations = Array.from(xml.querySelectorAll('trkpt')).map(point => Number(point.querySelector('ele')?.textContent)).filter(Number.isFinite)
    const segments = points.slice(1).map((point, index) => ({ point, previous: points[index], distance: segmentDistance(points[index], point) }))
    const distanceKm = segments.reduce((total, segment) => total + segment.distance, 0)
    const splitTimes: string[] = []
    let cumulativeDistance = 0
    let previousSplitTime = points[0].time
    let nextKm = 1
    segments.forEach(segment => {
      const segmentStartDistance = cumulativeDistance
      cumulativeDistance += segment.distance
      if (!Number.isFinite(previousSplitTime) || !Number.isFinite(segment.point.time) || segment.distance <= 0) return
      while (cumulativeDistance >= nextKm) {
        const fraction = Math.max(0, Math.min(1, (nextKm - segmentStartDistance) / segment.distance))
        const boundaryTime = segment.previous.time + (segment.point.time - segment.previous.time) * fraction
        const minutes = (boundaryTime - previousSplitTime) / 60000
        if (Number.isFinite(minutes) && minutes >= 0) {
          const wholeMinutes = Math.floor(minutes)
          const seconds = Math.round((minutes - wholeMinutes) * 60)
          const normalizedMinutes = seconds === 60 ? wholeMinutes + 1 : wholeMinutes
          splitTimes.push(`${nextKm}: ${normalizedMinutes}:${String(seconds === 60 ? 0 : seconds).padStart(2, '0')} min/km`)
          previousSplitTime = boundaryTime
        }
        nextKm += 1
      }
    })
    const elevationGain = elevations.slice(1).reduce((total, elevation, index) => total + Math.max(0, elevation - elevations[index]), 0)
    const elevationLoss = elevations.slice(1).reduce((total, elevation, index) => total + Math.max(0, elevations[index] - elevation), 0)
    setRunningDistance(distanceKm.toFixed(2))
    const timestamps = points.map(point => point.time).filter(Number.isFinite)
    const startTime = timestamps.length ? new Date(Math.min(...timestamps)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
    const endTime = timestamps.length ? new Date(Math.max(...timestamps)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'
    if (timestamps.length >= 2) { const minutes = (Math.max(...timestamps) - Math.min(...timestamps)) / 60000; setRunningTime(minutes.toFixed(1)); setRealPace('') }
    setGpxSummary({ elevationGain: Math.round(elevationGain), elevationLoss: Math.round(elevationLoss), startTime, endTime, splits: splitTimes })
    setGpxFileName(file.name)
  }
  const handleGpx = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) void parseGpx(file).catch(error => window.alert(error instanceof Error ? error.message : 'No se pudo leer el archivo GPX.')) }
  const available = catalog.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase()) && (group === 'Todos' || exercise.group === group) && !selectedExercises.some(selected => selected.id === exercise.id))
  const toggleExercise = (exercise: Exercise) => setSelectedExercises([...selectedExercises, { ...exercise }])
  const updateExercise = (id: string, key: 'sets' | 'reps' | 'weight', value: number) => setSelectedExercises(selectedExercises.map(exercise => exercise.id === id ? { ...exercise, [key]: Math.max(0, value) } : exercise))
  const parsePace = (value: string) => { const parts = value.split(':').map(Number); return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] + parts[1] / 60 : Number(value) }
  const totalMinutes = runningTime ? Number(runningTime) : 0
  const paceValue = parsePace(realPace)
  const calculatedPace = totalMinutes > 0 && Number(runningDistance) > 0 ? totalMinutes / Number(runningDistance) : 0
  const calculatedTime = paceValue > 0 && Number(runningDistance) > 0 ? paceValue * Number(runningDistance) : 0
  const averagePace = calculatedPace ? `${Math.floor(calculatedPace)}:${String(Math.round((calculatedPace % 1) * 60)).padStart(2, '0')} min/km` : '—'
  const totalDisplay = calculatedTime ? calculatedTime.toFixed(1) : '—'
  const updateBlock = (id: number, key: 'repetitions' | 'distance' | 'pace', value: string | number) => setRunningBlocks(runningBlocks.map(block => block.id === id ? { ...block, [key]: value } : block))
  return <div className="modal-backdrop" onClick={onClose}><div className="modal workout-modal" onClick={event => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">NUEVA ACTIVIDAD</p><h2>Registrar entrenamiento</h2></div><button className="close" onClick={onClose}>×</button></div><label>Nombre del entrenamiento<input value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="Ej. Carrera progresiva" autoFocus /></label><label>Tipo<select value={newType} onChange={event => setNewType(event.target.value)}><option>Gimnasio</option><option>Running</option><option>Ciclismo</option><option>Personalizado</option></select></label>{newType === 'Running' && <div className="running-form"><div className="mode-switch"><button type="button" className={runningMode === 'Rodaje' ? 'active' : ''} onClick={() => setRunningMode('Rodaje')}>Tirada / rodaje</button><button type="button" className={runningMode === 'Series' ? 'active' : ''} onClick={() => setRunningMode('Series')}>Series</button></div>{runningMode === 'Rodaje' ? <><div className="running-fields"><label>Distancia (km)<input type="number" min="0" step="0.1" value={runningDistance} onChange={event => setRunningDistance(event.target.value)} placeholder="10" /></label><label>Tiempo total (min)<input type="number" min="0" step="0.1" value={runningTime || (calculatedTime ? totalDisplay : '')} onChange={event => { setRunningTime(event.target.value); setRealPace('') }} placeholder="45" /></label></div><div className="running-fields"><label>Ritmo objetivo<input type="text" value={targetPace} onChange={event => setTargetPace(event.target.value)} placeholder="4:30 min/km" /></label><label>Ritmo real<input type="text" value={realPace || (averagePace !== '—' ? averagePace.replace(' min/km', '') : '')} onChange={event => { setRealPace(event.target.value); setRunningTime('') }} placeholder="4:30" /></label></div><div className="calculated-pace"><small>TIEMPO TOTAL CALCULADO SI USAS RITMO REAL</small><strong>{calculatedTime ? `${totalDisplay} min` : '—'}</strong><span>Introduce tiempo o ritmo real; el otro valor se calcula</span></div><div className={`gpx-upload ${gpxFileName ? 'gpx-uploaded' : ''}`}>{gpxFileName ? <div className="gpx-file-row"><div className="gpx-file-status"><span className="gpx-check">✓</span><span><strong>GPX cargado correctamente</strong><small>{gpxFileName}</small></span></div>{gpxSummary && <><div className="gpx-metrics"><span><b>{gpxSummary.elevationGain} m</b><small>desnivel +</small></span><span><b>{gpxSummary.elevationLoss} m</b><small>desnivel −</small></span><span><b>{gpxSummary.elevationGain + gpxSummary.elevationLoss} m</b><small>desnivel total</small></span><span><b>{gpxSummary.startTime}</b><small>inicio</small></span><span><b>{gpxSummary.endTime}</b><small>fin</small></span></div>{gpxSummary.splits.length > 0 && <div className="gpx-splits"><strong>Ritmo por km</strong><div>{gpxSummary.splits.map(split => <span key={split}>{split}</span>)}</div></div>}</>}<button type="button" className="remove-gpx" onClick={() => { setGpxFileName(''); setRunningDistance(''); setRunningTime(''); setRealPace(''); setGpxSummary(null) }}>Eliminar</button></div> : <label className="gpx-picker">Subir archivo GPX<input type="file" accept=".gpx" onChange={handleGpx} /><small>Extrae distancia y tiempo automáticamente</small></label>}</div></> : <div className="intervals"><div className="picker-heading"><strong>Bloques de series</strong><span>{runningBlocks.length} bloques</span></div>{runningBlocks.map((block, index) => <div className="interval-row" key={block.id}><span className="block-number">{index + 1}</span><label>Reps<input type="number" min="1" value={block.repetitions} onChange={event => updateBlock(block.id, 'repetitions', Number(event.target.value))} /></label><label>Distancia (m)<input type="number" min="1" value={block.distance} onChange={event => updateBlock(block.id, 'distance', Number(event.target.value))} /></label><label>Ritmo<input type="text" value={block.pace} onChange={event => updateBlock(block.id, 'pace', event.target.value)} placeholder="4:00" /></label><button type="button" className="remove-block" onClick={() => setRunningBlocks(runningBlocks.filter(item => item.id !== block.id))}>×</button></div>)}<button type="button" className="add-block" onClick={() => setRunningBlocks([...runningBlocks, { id: Date.now(), repetitions: 4, distance: 400, pace: '4:45' }])}>＋ Añadir bloque</button></div>}</div>}{newType === 'Gimnasio' && <div className="exercise-picker"><div className="picker-heading"><strong>Ejercicios</strong><span>{selectedExercises.length} seleccionados</span></div><div className="exercise-filters"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar ejercicio..." /><select value={group} onChange={event => setGroup(event.target.value)}><option>Todos</option>{groups.map(item => <option key={item}>{item}</option>)}</select></div><div className="exercise-results">{available.length ? available.map(exercise => <button type="button" className="exercise-option" key={exercise.id} onClick={() => toggleExercise(exercise)}><span><strong>{exercise.name}</strong><small>{exercise.group}</small></span><b>＋</b></button>) : <p className="empty-search">No hay ejercicios con esos filtros.</p>}</div>{selectedExercises.length > 0 && <div className="selected-exercises"><p className="eyebrow">SERIES Y CARGAS</p>{selectedExercises.map(exercise => <div className="selected-exercise" key={exercise.id}><div><strong>{exercise.name}</strong><small>{exercise.group}</small></div><label>Series<input type="number" min="1" value={exercise.sets} onChange={event => updateExercise(exercise.id, 'sets', Number(event.target.value))} /></label><label>Reps<input type="number" min="1" value={exercise.reps} onChange={event => updateExercise(exercise.id, 'reps', Number(event.target.value))} /></label><label>Kg<input type="number" min="0" step="0.5" value={exercise.weight} onChange={event => updateExercise(exercise.id, 'weight', Number(event.target.value))} /></label></div>)}</div>}</div>}<label className="rpe-picker"><span>RPE - ¿Cómo de duro ha sido el entrenamiento?</span><input type="range" min="1" max="10" value={rpe} onChange={event => setRpe(event.target.value)} /><div className="rpe-scale"><span>1 · Nada intenso</span><strong>{rpe}/10</strong><span>10 · Acabé destrozado</span></div></label><button className="primary-button full" onClick={onSave}>Guardar entrenamiento</button></div></div>
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
