import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'

import { useAuthStore } from './stores/useAuthStore.js'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaLogin from './pages/PaginaLogin.jsx'
import PaginaRegistro from './pages/PaginaRegistro.jsx'
import PaginaApp from './pages/PaginaApp.jsx'
import PaginaEjercicios from './pages/PaginaEjercicios.jsx'
import PaginaEjercicioDetalle from './pages/PaginaEjercicioDetalle.jsx'
import PaginaEjercicioForm from './pages/PaginaEjercicioForm.jsx'
import PaginaRutinas from './pages/PaginaRutinas.jsx'
import PaginaRutinaDetalle from './pages/PaginaRutinaDetalle.jsx'
import PaginaRutinaForm from './pages/PaginaRutinaForm.jsx'
import PaginaError from './pages/PaginaError.jsx'

// Inicializa el listener de autenticación antes de renderizar
useAuthStore.getState().init()

const miRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<PaginaInicio />} />
      <Route path='/login' element={<PaginaLogin />} />
      <Route path='/registro' element={<PaginaRegistro />} />
      <Route path='/app' element={<PaginaApp />} />
      <Route path='/app/ejercicios' element={<PaginaEjercicios />} />
      <Route path='/app/ejercicios/nuevo' element={<PaginaEjercicioForm />} />
      <Route path='/app/ejercicios/:id' element={<PaginaEjercicioDetalle />} />
      <Route path='/app/ejercicios/:id/editar' element={<PaginaEjercicioForm />} />
      <Route path='/app/rutinas' element={<PaginaRutinas />} />
      <Route path='/app/rutinas/nueva' element={<PaginaRutinaForm />} />
      <Route path='/app/rutinas/:id' element={<PaginaRutinaDetalle />} />
      <Route path='/app/rutinas/:id/editar' element={<PaginaRutinaForm />} />
      <Route path='*' element={<PaginaError />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={miRouter} />
  </StrictMode>,
)
