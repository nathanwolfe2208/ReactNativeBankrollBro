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
  gTypes: gameType[];
  fetchGameTypes: () => Promise<void>;
  addGameType: (gameType: gameType) => Promise<void>;
}

export type Location = {
  id: string;
  name: string;
};

export type gameType = {
  id: string;
  sb: number;
  bb: number;
  str?: number | null;
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
      const { data, error } = await supabase.from('locations').select('*');

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
  gTypes: [
    { id: '', sb: 1, bb: 2, str: 0 },
    { id: '', sb: 2, bb: 5, str: 0 },
    { id: '', sb: 5, bb: 10, str: 0 },
    { id: '', sb: 10, bb: 20, str: 0 },
  ],
  fetchGameTypes: async () => {
    try {
      const { data, error } = await supabase.from('game_types').select('*');

      if (error) throw error;

      if (data) {
        const formattedGTypes: gameType[] = data.map((gtype) => ({
          id: gtype.id,
          sb: gtype.sb,
          bb: gtype.bb,
          str: gtype.str,
        }));
        set((state) => ({ gTypes: [...state.gTypes, ...formattedGTypes] }));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  },
  addGameType: async (gameType: gameType) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User  not authenticated');
      }

      const { error } = await supabase.from('game_types').insert({
        user_id: userData.user.id,
        sb: gameType.sb,
        bb: gameType.bb,
        str: gameType.str,
      });

      if (error) throw error;

      set((state) => ({
        gTypes: [...state.gTypes, gameType],
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
