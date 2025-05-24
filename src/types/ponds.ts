export type Pond = {
  id: number;
  name: string;
  pondSize: string;
  stockingDensity: number;
  species: string;
  monitoring: string;
  deviceIds: string[];
  farmId: number; // Link pond to farm
};

export type PondForm = {
  pondName: string;
  pondSize: string;
  species: string;
  stockingDensity: string; // This is a string initially, convert to number when saving
  monitoring: string; // e.g., 'manual' or 'sensor'
  deviceIds: string[]; // Only used when monitoring is 'sensor'
};

export type AddFarmInPond = PondForm & {
  newDeviceId: string;
  farmId: number | '';
};



export type AddNewPond ={
  pondName: string;
  pondSize: string;
  species: string;
  stockingDensity: string;
  monitoring: string;
  deviceIds: string[];
  newDeviceId: string; // ✅ Add this line
}


export type PondSizeOption = {
  id: number;
  name: string;
  sizeType: string;
};

export type SpeciesOption = {
  id: number;
  name: string;
  speciesType: string;
};

