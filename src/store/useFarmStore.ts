import { create } from 'zustand';

export type Farm = {
  id: string;              // UUID
  name: string;
  location: string;        // Your “location” field
  farmSize: string;        // e.g. "2Acre"
  farmType: string;        // e.g. "freshwater"
  waterSrc: string;        // e.g. "canal"
  address: string;         // street address
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: string;
  longitude?: string;
  notes?: string;
  pondCount?: number;      // how many ponds
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  owner?: {
    id: string;
    name: string;
    email?: string;
  };
  ponds?: any[];           // if your API returns related pond objects
};
interface FarmStore {
  farms: Farm[];
  setFarms: (farms: Farm[]) => void;
  updateFarm: (updatedFarm: Partial<Farm> & { id: string }) => void;
  addFarm: (farm: Farm) => void;
}

export const useFarmStore = create<FarmStore>((set) => ({
  farms: [],
  setFarms: (farms) => set({ farms }),
  updateFarm: (updatedFarm) =>
    set((state) => ({
      farms: state.farms.map((f) =>
        f.id === updatedFarm.id ? { ...f, ...updatedFarm } : f
      ),
    })),
  addFarm: (farm) =>
    set((state) => ({
      farms: [...state.farms, farm],
    })),
}));