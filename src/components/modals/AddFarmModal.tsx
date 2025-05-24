import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  Box,
  RadioGroup,
  Radio,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FarmForm, FarmSize, FarmType, WaterSource } from '../../types/farms';
import { AddNewPond, PondForm, PondSizeOption, SpeciesOption } from '../../types/ponds';
import ReactSelect from 'react-select';

interface Device {
  deviceId: string;
  type: string;
}



const AddFarmWithPondModal = ({
  isOpen,
  onClose,
  onSave,
  farmSizes,
  farmTypes,
  waterSources,
  pondSizes,
  speciesList,
  users,
  devices,            
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  farmSizes: FarmSize[];
  farmTypes: FarmType[];
  waterSources: WaterSource[];
  pondSizes: PondSizeOption[];
  speciesList: SpeciesOption[]
  users: any[];
   devices: Device[];
}) => {
  const [step, setStep] = useState(1);

  const [farmForm, setFarmForm] = useState<FarmForm>({
  farmName: '',
  location: '',
  farmSize: '',
  farmType: '',
  waterSource: '',
  userId: '',
  notes: '',
  deviceIds: [],
  address: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
});

  
  const [pondForm, setPondForm] = useState<AddNewPond>({
    pondName: '',
    pondSize: '',
    stockingDensity: '',
    species: '',
    monitoring: 'manual',
    newDeviceId: '',
    deviceIds: [],
  });

  const handleFarmChange = (e: any) => {
    const { name, value } = e.target;
    setFarmForm({ ...farmForm, [name]: value });
  };

  const handlePondChange = (e: any) => {
    const { name, value } = e.target;
    setPondForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field: keyof Pick<FarmForm, 'address'|'city'|'state'|'country'|'pincode'>, val: string) => {
  setFarmForm(prev => ({ ...prev, [field]: val }));
};


  const handlePondDeviceAdd = () => {
    const trimmed = pondForm.newDeviceId.trim();
    if (trimmed && !pondForm.deviceIds.includes(trimmed)) {
      setPondForm((prev) => ({
        ...prev,
        deviceIds: [...prev.deviceIds, trimmed],
        newDeviceId: '',
      }));
    }
  };

  const handlePondDeviceRemove = (id: any) => {
    setPondForm((prev) => ({
      ...prev,
      deviceIds: prev.deviceIds.filter((d) => d !== id),
    }));
  };

  const handleFarmContinue = () => {
    const required: (keyof FarmForm)[] = ['farmName', 'location', 'farmSize', 'farmType', 'waterSource', 'userId'];
    if (required.every((key) => farmForm[key])) {
      setStep(2);
    } else {
      alert('Please fill all required fields');
    }
  };

  const clearFarmAndPondForm = () => {
  setFarmForm({
    farmName: '',
    location: '',
    farmSize: '',
    farmType: '',
    waterSource: '',
    userId: '',
    notes: '',
    newDevice: '',
    deviceIds: [],
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  setPondForm({
    pondName: '',
    pondSize: '',
    stockingDensity: '',
    species: '',
    monitoring: 'manual',
    newDeviceId: '',
    deviceIds: [],
  });
};


  const handleFinalSubmit = () => {
    const required: (keyof PondForm)[] = ['pondName', 'pondSize', 'species'];
  if (required.every((key) => pondForm[key])) {
      const data = {
        farm: farmForm,
        pond: {
          ...pondForm,
          stockingDensity: Number(pondForm.stockingDensity) || 0,
          deviceIds: pondForm.monitoring === 'sensor' ? pondForm.deviceIds : [],
        },
      };
      console.log('Final Data:', data);
      onSave(data);
      clearFarmAndPondForm();
      setStep(1);
      onClose();
    } else {
      console.log('pondform', pondForm)
      alert('Please fill all required pond fields');
    }
  };

  
  const deviceOptions = devices.map((d) => ({
  label: `${d.deviceId} (${d.type})`,
  value: d.deviceId,
}));


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" closeOnOverlayClick={false}
    closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent maxH="85vh">
        <ModalHeader>{step === 1 ? 'Add New Farm' : 'Add Pond Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody 
         overflowY="auto"  
          sx={{
                    '&::-webkit-scrollbar': {
                    width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                    background: 'gray.100',
                    borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                    background: 'gray.400',
                    borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                    background: 'gray.500',
                    },
                }}>
          {step === 1 ? (
            <Stack spacing={4}>
              <FormControl isRequired><FormLabel>Farm Name</FormLabel><Input name="farmName" value={farmForm.farmName} onChange={handleFarmChange} /></FormControl>
              <FormControl isRequired><FormLabel>Location</FormLabel><Input name="location" value={farmForm.location} onChange={handleFarmChange} /></FormControl>
              <FormControl isRequired><FormLabel>Farm Size</FormLabel><Select name="farmSize" value={farmForm.farmSize} onChange={handleFarmChange}><option value="">Select size</option>{farmSizes.map((opt) => <option key={opt.id} value={opt.sizeType}>{opt.name}</option>)}</Select></FormControl>
              <FormControl isRequired><FormLabel>Farm Type</FormLabel><Select name="farmType" value={farmForm.farmType} onChange={handleFarmChange}><option value="">Select type</option>{farmTypes.map((opt) => <option key={opt.id} value={opt.farmType}>{opt.name}</option>)}</Select></FormControl>
              <FormControl isRequired><FormLabel>Water Source</FormLabel><Select name="waterSource" value={farmForm.waterSource} onChange={handleFarmChange}><option value="">Select source</option>{waterSources.map((opt) => <option key={opt.id} value={opt.srcType}>{opt.name}</option>)}</Select></FormControl>
              <FormControl isRequired><FormLabel>Assign User</FormLabel><Select name="userId" value={farmForm.userId} onChange={handleFarmChange}><option value="">Select user</option>{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></FormControl>
              <FormControl>
  <FormLabel>Street Address</FormLabel>
  <Input
    placeholder="123 Main St"
    value={farmForm.address}
    onChange={e => handleAddressChange('address', e.target.value)}
  />
</FormControl>
<Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
  <FormControl>
    <FormLabel>City</FormLabel>
    <Input
      placeholder="City"
      value={farmForm.city}
      onChange={e => handleAddressChange('city', e.target.value)}
    />
  </FormControl>
  <FormControl>
    <FormLabel>State</FormLabel>
    <Input
      placeholder="State"
      value={farmForm.state}
      onChange={e => handleAddressChange('state', e.target.value)}
    />
  </FormControl>
</Stack>
<Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
  <FormControl>
    <FormLabel>Country</FormLabel>
    <Input
      placeholder="Country"
      value={farmForm.country}
      onChange={e => handleAddressChange('country', e.target.value)}
    />
  </FormControl>
  <FormControl>
    <FormLabel>Pincode</FormLabel>
    <Input
      placeholder="Pincode"
      value={farmForm.pincode}
      onChange={e => handleAddressChange('pincode', e.target.value)}
    />
  </FormControl>
</Stack>

              <FormControl><FormLabel>Notes</FormLabel><Textarea name="notes" value={farmForm.notes} onChange={handleFarmChange} /></FormControl>
      <FormControl>
  <FormLabel>Devices</FormLabel>
  <ReactSelect
    isMulti
    name="deviceIds"
    options={deviceOptions}
    value={deviceOptions.filter((opt) =>
      farmForm.deviceIds.includes(opt.value)
    )}
    onChange={(selectedOptions) => {
      const selectedIds = selectedOptions.map((opt) => opt.value);
      setFarmForm((prev) => ({ ...prev, deviceIds: selectedIds }));
    }}
    menuPlacement="top"
  />
  {farmForm.deviceIds.length > 0 && (
    <Text fontSize="sm" color="gray.600" mt={1}>
      Selected: {farmForm.deviceIds.join(', ')}
    </Text>
  )}
</FormControl>

            </Stack>
          ) : (
            <Stack spacing={4}>
              <FormControl isRequired><FormLabel>Pond Name</FormLabel><Input name="pondName" value={pondForm.pondName} onChange={handlePondChange} /></FormControl>
              <FormControl isRequired><FormLabel>Pond Size</FormLabel><Select name="pondSize" value={pondForm.pondSize} onChange={handlePondChange}><option value="">Select size</option>{pondSizes.map((opt) => <option key={opt.sizeType} value={opt.sizeType}>{opt.name}</option>)}</Select></FormControl>
              <FormControl><FormLabel>Stocking Density</FormLabel><Input name="stockingDensity" value={pondForm.stockingDensity} onChange={handlePondChange} /></FormControl>
              <FormControl isRequired><FormLabel>Species</FormLabel><Select name="species" value={pondForm.species} onChange={handlePondChange}><option value="">Select species</option>{speciesList.map((opt) => <option key={opt.speciesType} value={opt.speciesType}>{opt.name}</option>)}</Select></FormControl>
              <FormControl><FormLabel>Monitoring</FormLabel><RadioGroup value={pondForm.monitoring} onChange={(val) => setPondForm((prev) => ({ ...prev, monitoring: val }))}><Stack direction="row"><Radio value="manual">Manual</Radio><Radio value="sensor">Sensor</Radio></Stack></RadioGroup></FormControl>
              {pondForm.monitoring === 'sensor' && (
                <FormControl><FormLabel>Device IDs</FormLabel><HStack><Input name="newDeviceId" value={pondForm.newDeviceId} onChange={handlePondChange} /><Button size="sm" onClick={handlePondDeviceAdd}>Add</Button></HStack><HStack mt={2}>{pondForm.deviceIds.map((id) => (<Tag key={id} size="md" borderRadius="full" variant="solid" colorScheme="blue"><TagLabel>{id}</TagLabel><TagCloseButton onClick={() => handlePondDeviceRemove(id)} /></Tag>))}</HStack></FormControl>
              )}
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          {step === 1 ? (
            <Button colorScheme="teal" onClick={handleFarmContinue}>Continue</Button>
          ) : (
            <Button colorScheme="green" onClick={handleFinalSubmit}>Submit</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFarmWithPondModal;
