import { Pond } from "./ponds";
import { User } from "./users";

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

export type FarmForm = {
  farmName: string;
  location: string;
  farmSize: string;
  farmType: string;
  waterSource: string;
  userId: string;
  notes: string;
  newDevice?: string;
  deviceIds: string[]; // ← FIXED: explicitly declare as array of strings
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};


export type FarmWithUserAndPonds = {
  id: number;
  name: string;
  location: string;
  farmSize: string;
  farmType: string;
  waterSource: string;
  user: User;
  ponds: Omit<Pond, 'farmId'>[];
};

export interface FarmSize {
  id: number;
  name: string;
  sizeType: string;
}



export interface FarmType {
  id: number;
  name: string;
  farmType: string;
}

export interface WaterSource {
  id: number;
  name: string;
  srcType: string;
}
