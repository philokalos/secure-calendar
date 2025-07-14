import { useState, useEffect, useCallback, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Event, EventFormData } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  createEvent: (eventData: EventFormData) => Promise<{ data: Event | null; error: string | null }>
  createEvents: (
    eventsData: EventFormData[]
  ) => Promise<{ data: Event[] | null; error: string | null }>
  updateEvent: (
    id: string,
    eventData: Partial<EventFormData>
  ) => Promise<{ data: Event | null; error: string | null }>
  deleteEvent: (id: string) => Promise<{ error: string | null }>
  refetch: () => Promise<void>
  searchEvents: (query: string) => Event[]
  getEventsByDateRange: (startDate: Date, endDate: Date) => Event[]
  getEventsByCategory: (category: string) => Event[]
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events'
      setError(errorMessage)
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const createEvent = async (eventData: EventFormData) => {
    if (!user) return { data: null, error: 'User not authenticated' }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...eventData,
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event'
      setError(errorMessage)
      console.error('Error creating event:', err)
      return { data: null, error: errorMessage }
    }
  }

  const createEvents = async (eventsData: EventFormData[]) => {
    if (!user) return { data: null, error: 'User not authenticated' }
    if (eventsData.length === 0) return { data: [], error: null }

    try {
      setError(null)

      const eventsWithUserId = eventsData.map(eventData => ({
        ...eventData,
        user_id: user.id,
      }))

      const { data, error } = await supabase.from('events').insert(eventsWithUserId).select()

      if (error) throw error

      return { data: data || [], error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create events'
      setError(errorMessage)
      console.error('Error creating events:', err)
      return { data: null, error: errorMessage }
    }
  }

  const updateEvent = async (id: string, eventData: Partial<EventFormData>) => {
    if (!user) return { data: null, error: 'User not authenticated' }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      console.error('Error updating event:', err)
      return { data: null, error: errorMessage }
    }
  }

  const deleteEvent = async (id: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      setError(null)

      const { error } = await supabase.from('events').delete().eq('id', id).eq('user_id', user.id)

      if (error) throw error

      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      console.error('Error deleting event:', err)
      return { error: errorMessage }
    }
  }

  const searchEvents = useCallback(
    (query: string): Event[] => {
      if (!query.trim()) return events

      const lowercaseQuery = query.toLowerCase()
      return events.filter(
        event =>
          event.title.toLowerCase().includes(lowercaseQuery) ||
          event.description?.toLowerCase().includes(lowercaseQuery) ||
          event.location?.toLowerCase().includes(lowercaseQuery) ||
          event.category?.toLowerCase().includes(lowercaseQuery)
      )
    },
    [events]
  )

  const getEventsByDateRange = useCallback(
    (startDate: Date, endDate: Date): Event[] => {
      return events.filter(event => {
        const eventStart = new Date(event.start_date)
        const eventEnd = new Date(event.end_date)
        return (
          (eventStart >= startDate && eventStart <= endDate) ||
          (eventEnd >= startDate && eventEnd <= endDate) ||
          (eventStart <= startDate && eventEnd >= endDate)
        )
      })
    },
    [events]
  )

  const getEventsByCategory = useCallback(
    (category: string): Event[] => {
      if (!category) return events
      return events.filter(event => event.category === category)
    },
    [events]
  )

  // Real-time subscription setup
  useEffect(() => {
    if (!user) {
      // Clean up subscription if user logs out
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      return
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('events_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}`,
        },
        payload => {
          console.log('Real-time event:', payload)

          switch (payload.eventType) {
            case 'INSERT':
              setEvents(prev => {
                const newEvent = payload.new as Event
                return [...prev, newEvent].sort(
                  (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
                )
              })
              break

            case 'UPDATE':
              setEvents(prev =>
                prev.map(event => (event.id === payload.new.id ? (payload.new as Event) : event))
              )
              break

            case 'DELETE':
              setEvents(prev => prev.filter(event => event.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    // Clean up on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [user])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    createEvent,
    createEvents,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
    searchEvents,
    getEventsByDateRange,
    getEventsByCategory,
  }
}
