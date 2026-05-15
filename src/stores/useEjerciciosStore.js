import { create } from 'zustand'
import { supabase } from '../data/supabase.js'

export const useEjerciciosStore = create((set) => ({
  ejercicios: [],
  cargando: false,
  error: null,

  cargar: async () => {
    set({ cargando: true, error: null })
    const { data, error } = await supabase
      .from('ejercicios')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) set({ error: 'Error al cargar ejercicios', cargando: false })
    else set({ ejercicios: data || [], cargando: false })
  },

  eliminar: async (id) => {
    const { error } = await supabase.from('ejercicios').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ ejercicios: state.ejercicios.filter((ej) => ej.id !== id) }))
  },
}))
