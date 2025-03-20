import { Session } from '@/components/SessionCard';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

interface SessionsStore {
  sessions: Session[];
  fetchSessions: () => Promise<void>;
  addSession: (session: Session) => Promise<void>;
  Locs: Location[];
  fetchLocations: () => Promise<void>;
  addLocation: (location: Location) => Promise<void>;
}

export type Location = {
  id: string;
  name: string;
};

const useSessionsStore = create<SessionsStore>((set) => ({
  sessions: [],
  fetchSessions: async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedSessions: Session[] = data.map((session) => ({
          id: session.id,
          date: session.date,
          location: session.location,
          buyIn: session.buy_in,
          cashOut: session.cash_out,
          duration: session.duration,
          gameType: session.game_type,
        }));
        set({ sessions: formattedSessions });
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  },
  addSession: async (session: Session) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User  not authenticated');
      }

      const { error } = await supabase.from('sessions').insert({
        user_id: userData.user.id,
        location: session.location,
        game_type: session.gameType,
        buy_in: session.buyIn,
        cash_out: session.cashOut,
        duration: session.duration,
        date: session.date,
        notes: session.notes || '',
      });

      if (error) throw error;

      // Update the Zustand store with the new session
      set((state) => ({
        sessions: [...state.sessions, session], // Add the new session to the existing sessions
      }));
    } catch (error: any) {
      console.error(
        'Error adding session:',
        error.message || 'Failed to add session',
      );
    }
  },
  Locs: [],
  fetchLocations: async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*');

      if (error) throw error;

      if (data) {
        const formattedLocs: Location[] = data.map((location) => ({
          id: location.id,
          name: location.name,
        }));
        set({ Locs: formattedLocs });
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  },
  addLocation: async (loc: Location) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User  not authenticated');
      }

      const { error } = await supabase.from('locations').insert({
        user_id: userData.user.id,
        name: loc.name,
      });

      if (error) throw error;

      set((state) => ({
        Locs: [...state.Locs, loc],
      }));
    } catch (error: any) {
      console.error(
        'Error adding location:',
        error.message || 'Failed to add location',
      );
    }
  },
}));

export default useSessionsStore;
