import { create } from 'zustand'
import { supabase } from '../data/supabase.js'

export const useAuthStore = create((set, get) => ({
  user: null,
  username: null,
  isDark: true,

  init: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        set({ user: session.user, username: session.user.email })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ user: session.user, username: session.user.email })
      } else {
        set({ user: null, username: null })
      }
    })

    return () => listener.subscription.unsubscribe()
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  registro: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  },

  logout: async () => {
    await supabase.auth.signOut()
  },

  toggleDark: () => {
    const isDark = get().isDark
    if (isDark) {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    set({ isDark: !isDark })
  },
}))
