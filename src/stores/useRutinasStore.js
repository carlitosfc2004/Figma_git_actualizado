import { create } from 'zustand'
import { supabase } from '../data/supabase.js'

export const useRutinasStore = create((set) => ({
  rutinas: [],
  cargando: false,
  error: null,

  cargar: async () => {
    set({ cargando: true, error: null })
    const { data, error } = await supabase
      .from('rutinas')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) set({ error: 'Error al cargar rutinas', cargando: false })
    else set({ rutinas: data || [], cargando: false })
  },

  eliminar: async (id) => {
    const { error } = await supabase.from('rutinas').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ rutinas: state.rutinas.filter((r) => r.id !== id) }))
  },
}))
