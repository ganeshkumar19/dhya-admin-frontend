import { create } from 'zustand';
import { LocationData } from '../api/location';



interface LocationState {
  locationData: LocationData | null;
  setLocationData: (data: LocationData) => void;
  clearLocationData: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  locationData: null,
  setLocationData: (data) => set({ locationData: data }),
  clearLocationData: () => set({ locationData: null }),
}));
