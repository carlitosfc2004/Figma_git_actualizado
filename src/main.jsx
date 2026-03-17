import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import { AuthProvider } from './data/authContext.jsx'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaLogin from './pages/PaginaLogin.jsx'
import PaginaRegistro from './pages/PaginaRegistro.jsx'
import PaginaApp from './pages/PaginaApp.jsx'
import PaginaEjercicios from './pages/PaginaEjercicios.jsx'
import PaginaEjercicioDetalle from './pages/PaginaEjercicioDetalle.jsx'
import PaginaEjercicioForm from './pages/PaginaEjercicioForm.jsx'
import PaginaError from './pages/PaginaError.jsx'

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
      <Route path='*' element={<PaginaError />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={miRouter} />
    </AuthProvider>
  </StrictMode>,
)